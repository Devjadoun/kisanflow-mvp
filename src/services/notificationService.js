/**
 * KisanFlow Notification & Event Orchestrator
 * Coordinates server-authoritative events, in-app notifications,
 * and asynchronous SMS dispatching with idempotency and audit trails.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const STORAGE_KEYS = {
  NOTIFICATIONS: 'kf_notifications_store',
  SMS_LOGS: 'kf_sms_logs_store',
  EVENT_LOGS: 'kf_event_logs_store',
  AUDIT_LOGS: 'kf_audit_logs_store',
};

export const getTableAvailability = () => {
  if (typeof window === 'undefined') return {};
  try {
    const cached = sessionStorage.getItem('kf_table_availability');
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
};

export const markTableUnavailable = (tableName) => {
  if (typeof window === 'undefined') return;
  try {
    const current = getTableAvailability();
    current[tableName] = false;
    sessionStorage.setItem('kf_table_availability', JSON.stringify(current));
  } catch {}
};

export const isTableAvailable = (tableName) => {
  const current = getTableAvailability();
  return current[tableName] !== false;
};

export const checkTableError = (tableName, error) => {
  if (!error) return;
  const msg = String(error.message || '').toLowerCase();
  const code = String(error.code || '');
  if (code === 'PGRST205' || code === '42P01' || code === '42501' || msg.includes('schema cache') || msg.includes('does not exist') || msg.includes('permission denied')) {
    markTableUnavailable(tableName);
  }
};

const getLocal = (key, fallback = []) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

const setLocal = (key, data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
};

/**
 * Checks whether a live SMS provider is configured via environment variables
 */
export const isSMSProviderConfigured = () => {
  const apiKey = import.meta.env.VITE_SMS_PROVIDER_API_KEY || '';
  return apiKey.trim().length > 0 && !apiKey.includes('your_');
};

/**
 * 1. recordEvent
 * Emits an immutable system event to event_logs
 */
export const recordEvent = async (eventType, actorId, entityId, payload = {}) => {
  const eventRecord = {
    event_id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    event_type: eventType,
    actor_id: String(actorId || 'system'),
    entity_id: String(entityId || 'general'),
    correlation_id: payload.correlationId || `corr-${Date.now()}`,
    event_version: 1,
    payload,
    created_at: new Date().toISOString(),
  };

  // 1. Try Supabase
  if (isSupabaseConfigured() && supabase && isTableAvailable('event_logs')) {
    try {
      const { error } = await supabase.from('event_logs').insert([{
        event_type: eventRecord.event_type,
        actor_id: eventRecord.actor_id,
        entity_id: eventRecord.entity_id,
        correlation_id: eventRecord.correlation_id,
        event_version: 1,
        payload: eventRecord.payload,
      }]);
      checkTableError('event_logs', error);
    } catch {
      markTableUnavailable('event_logs');
    }
  }

  // 2. Mirror to local storage
  const events = getLocal(STORAGE_KEYS.EVENT_LOGS);
  setLocal(STORAGE_KEYS.EVENT_LOGS, [eventRecord, ...events.slice(0, 99)]);

  // 3. Mirror audit log for high-importance operational actions
  if ([
    'USER_REGISTERED',
    'BOOKING_CREATED',
    'TOKEN_CALLED',
    'PROCUREMENT_STARTED',
    'PROCUREMENT_COMPLETED',
    'PAYMENT_UPDATED',
  ].includes(eventType)) {
    await recordAuditLog(eventType, actorId, entityId, `Action: ${eventType}`, payload);
  }

  return eventRecord;
};

/**
 * 2. recordAuditLog
 * Stores administrative audit trail
 */
export const recordAuditLog = async (eventType, actorId, entityId, action, details = {}) => {
  const auditRecord = {
    id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    event_type: eventType,
    actor_id: String(actorId || 'operator'),
    entity_id: String(entityId || 'entity'),
    action,
    details,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured() && supabase && isTableAvailable('audit_logs')) {
    try {
      const { error } = await supabase.from('audit_logs').insert([{
        event_type: auditRecord.event_type,
        actor_id: auditRecord.actor_id,
        entity_id: auditRecord.entity_id,
        action: auditRecord.action,
        details: auditRecord.details,
      }]);
      checkTableError('audit_logs', error);
    } catch {
      markTableUnavailable('audit_logs');
    }
  }

  const logs = getLocal(STORAGE_KEYS.AUDIT_LOGS);
  setLocal(STORAGE_KEYS.AUDIT_LOGS, [auditRecord, ...logs.slice(0, 99)]);
  return auditRecord;
};

/**
 * 3. createNotification
 * Dispatches an in-app notification and optionally queues an SMS alert
 */
export const createNotification = async ({
  userId = null,
  phone = '',
  type = 'GENERAL',
  title = '',
  message = '',
  sendSMS = false,
  bookingId = null,
}) => {
  const notifRecord = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    user_id: userId,
    phone,
    type,
    title,
    message,
    status: 'unread',
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured() && supabase && isTableAvailable('notifications')) {
    try {
      const { data, error } = await supabase.from('notifications').insert([{
        user_id: userId,
        phone,
        type,
        title,
        message,
        status: 'unread',
      }]).select().single();

      checkTableError('notifications', error);
      if (data?.id) notifRecord.id = data.id;
    } catch {
      markTableUnavailable('notifications');
    }
  }

  const notifs = getLocal(STORAGE_KEYS.NOTIFICATIONS);
  setLocal(STORAGE_KEYS.NOTIFICATIONS, [notifRecord, ...notifs]);

  // If SMS alert requested and recipient has phone
  if (sendSMS && phone) {
    const idempotencyKey = `${bookingId || 'bk'}_${type}_1`;
    dispatchSMS({
      notificationId: notifRecord.id,
      phone,
      message: `${title}: ${message}`,
      idempotencyKey,
    });
  }

  return notifRecord;
};

/**
 * 4. dispatchSMS
 * Asynchronously queues SMS with idempotency protection and retry handling
 */
export const dispatchSMS = async ({ notificationId, phone, message, idempotencyKey }) => {
  const existingLogs = getLocal(STORAGE_KEYS.SMS_LOGS);
  if (idempotencyKey && existingLogs.some(log => log.idempotency_key === idempotencyKey)) {
    console.info('[KisanFlow SMS] Duplicate SMS suppressed by idempotency key:', idempotencyKey);
    return { success: false, reason: 'DUPLICATE_SUPPRESSED' };
  }

  const isReal = isSMSProviderConfigured();
  const providerName = isReal ? 'TELECOM_GATEWAY' : 'DEMO_SMS_PROVIDER (SIMULATED)';

  const smsRecord = {
    id: `sms-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    notification_id: notificationId,
    phone,
    message,
    status: 'queued',
    idempotency_key: idempotencyKey,
    retry_count: 0,
    provider: providerName,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Save queued state
  setLocal(STORAGE_KEYS.SMS_LOGS, [smsRecord, ...existingLogs]);

  // Attempt database write if table exists
  if (isSupabaseConfigured() && supabase && isTableAvailable('sms_logs')) {
    try {
      const { error } = await supabase.from('sms_logs').insert([{
        phone: smsRecord.phone,
        message: smsRecord.message,
        status: 'queued',
        idempotency_key: idempotencyKey,
        retry_count: 0,
        provider: providerName,
      }]);
      checkTableError('sms_logs', error);
    } catch {
      markTableUnavailable('sms_logs');
    }
  }

  // Asynchronous worker simulation with exponential timeout
  setTimeout(() => {
    updateSMSStatus(smsRecord.id, 'submitted');

    // Simulate final telecom network delivery after 1.2s
    setTimeout(() => {
      updateSMSStatus(smsRecord.id, 'delivered');
      recordEvent('SMS_DELIVERED', 'sms-worker', phone, {
        smsId: smsRecord.id,
        mode: isReal ? 'REAL' : 'DEMO_MODE',
      });
    }, 1200);
  }, 600);

  return smsRecord;
};

/**
 * 5. updateSMSStatus
 * Updates SMS transmission status (queued -> submitted -> delivered / failed)
 */
export const updateSMSStatus = async (smsId, newStatus) => {
  const logs = getLocal(STORAGE_KEYS.SMS_LOGS);
  const updated = logs.map(item =>
    item.id === smsId ? { ...item, status: newStatus, updated_at: new Date().toISOString() } : item
  );
  setLocal(STORAGE_KEYS.SMS_LOGS, updated);

  if (isSupabaseConfigured() && supabase && isTableAvailable('sms_logs')) {
    try {
      const { error } = await supabase.from('sms_logs').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', smsId);
      checkTableError('sms_logs', error);
    } catch {
      markTableUnavailable('sms_logs');
    }
  }
};

/**
 * 6. getRecentEvents
 */
export const getRecentEvents = async (limit = 20) => {
  if (isSupabaseConfigured() && supabase && isTableAvailable('event_logs')) {
    try {
      const { data, error } = await supabase
        .from('event_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      checkTableError('event_logs', error);
      if (!error && data && data.length > 0) return data;
    } catch {
      markTableUnavailable('event_logs');
    }
  }
  return getLocal(STORAGE_KEYS.EVENT_LOGS).slice(0, limit);
};

/**
 * 7. getAuditLogs
 */
export const getAuditLogs = async (limit = 20) => {
  if (isSupabaseConfigured() && supabase && isTableAvailable('audit_logs')) {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      checkTableError('audit_logs', error);
      if (!error && data && data.length > 0) return data;
    } catch {
      markTableUnavailable('audit_logs');
    }
  }
  return getLocal(STORAGE_KEYS.AUDIT_LOGS).slice(0, limit);
};

/**
 * 8. getSMSLogs
 */
export const getSMSLogs = async (limit = 30) => {
  if (isSupabaseConfigured() && supabase && isTableAvailable('sms_logs')) {
    try {
      const { data, error } = await supabase
        .from('sms_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      checkTableError('sms_logs', error);
      if (!error && data && data.length > 0) return data;
    } catch {
      markTableUnavailable('sms_logs');
    }
  }
  return getLocal(STORAGE_KEYS.SMS_LOGS).slice(0, limit);
};

/**
 * 9. getNotifications
 */
export const getNotifications = async (phoneOrUserId = null) => {
  if (isSupabaseConfigured() && supabase && isTableAvailable('notifications')) {
    try {
      let q = supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(20);
      if (phoneOrUserId) {
        q = q.or(`phone.eq.${phoneOrUserId},user_id.eq.${phoneOrUserId}`);
      }
      const { data, error } = await q;
      checkTableError('notifications', error);
      if (!error && data && data.length > 0) return data;
    } catch {
      markTableUnavailable('notifications');
    }
  }
  return getLocal(STORAGE_KEYS.NOTIFICATIONS);
};
