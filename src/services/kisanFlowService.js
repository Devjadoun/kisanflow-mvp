/**
 * KisanFlow Data Access Layer
 * Handles CRUD operations with Supabase PostgreSQL backend,
 * with automatic fallback to persistent localStorage for seamless offline/prototype operation.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import {
  INITIAL_ACTIVE_BOOKING,
  INITIAL_QUEUE_LIST,
  OPERATOR_TODAYS_BOOKINGS,
  REWARDS_HISTORY,
  COMMODITIES,
  PROCUREMENT_CENTRES,
} from '../data/mockData';

const LOCAL_STORAGE_KEYS = {
  BOOKINGS: 'kf_bookings_store',
  ACTIVE_BOOKING: 'kf_activeBooking',
  OPERATOR_BOOKINGS: 'kf_operatorBookings',
  QUEUE_LIST: 'kf_queueList',
  PAYMENTS: 'kf_payments_store',
  FEEDBACK: 'kf_feedback_store',
  REWARDS: 'kf_rewardsHistory',
};

// Safe localStorage helpers
const getLocal = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const setLocal = (key, val) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
};

/**
 * 1. createBooking
 * Inserts a new booking into Supabase (if connected) and synchronizes with local state
 */
export const createBooking = async (bookingData) => {
  let createdRecord = { ...bookingData };

  if (isSupabaseConfigured() && supabase) {
    try {
      const payload = {
        booking_id: bookingData.bookingId,
        centre_id: bookingData.centreId || 'dadri',
        commodity_id: bookingData.commodityId || 'wheat',
        quantity: Number(bookingData.quantityKg),
        token: bookingData.token,
        queue_position: Number(bookingData.queuePosition || 1),
        predicted_wait_minutes: Number(bookingData.predictedWaitMinutes || 35),
        status: (bookingData.status || 'booked').toLowerCase(),
        total_estimated_amount: Number(bookingData.totalEstimatedAmount || 0),
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.warn('[KisanFlow] Supabase insert booking error, using local fallback:', error.message);
      } else if (data) {
        createdRecord.supabaseId = data.id;
        console.info('[KisanFlow] Booking persisted to Supabase:', data.booking_id);
      }
    } catch (err) {
      console.warn('[KisanFlow] Exception writing to Supabase, continuing in local fallback mode:', err);
    }
  }

  // Always mirror to local storage cache for instant UI availability & refresh safety
  const allBookings = getLocal(LOCAL_STORAGE_KEYS.BOOKINGS, []);
  setLocal(LOCAL_STORAGE_KEYS.BOOKINGS, [createdRecord, ...allBookings]);
  setLocal(LOCAL_STORAGE_KEYS.ACTIVE_BOOKING, createdRecord);

  return createdRecord;
};

/**
 * 2. getBooking
 * Fetches single booking by booking ID or Token
 */
export const getBooking = async (idOrToken) => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .or(`booking_id.eq.${idOrToken},token.eq.${idOrToken}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return {
          bookingId: data.booking_id,
          token: data.token,
          centreId: data.centre_id,
          commodityId: data.commodity_id,
          quantityKg: data.quantity,
          status: data.status.charAt(0).toUpperCase() + data.status.slice(1),
          queuePosition: data.queue_position,
          predictedWaitMinutes: data.predicted_wait_minutes,
          totalEstimatedAmount: data.total_estimated_amount,
        };
      }
    } catch (err) {
      console.warn('[KisanFlow] Error fetching booking from Supabase:', err);
    }
  }

  // Fallback: check active booking or booking store
  const active = getLocal(LOCAL_STORAGE_KEYS.ACTIVE_BOOKING, INITIAL_ACTIVE_BOOKING);
  if (active && (active.bookingId === idOrToken || active.token === idOrToken)) {
    return active;
  }
  const all = getLocal(LOCAL_STORAGE_KEYS.BOOKINGS, []);
  const found = all.find(b => b.bookingId === idOrToken || b.token === idOrToken);
  return found || active;
};

/**
 * 3. getFarmerBookings
 * Fetches all bookings for a given farmer profile
 */
export const getFarmerBookings = async (farmerId) => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const query = supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (farmerId) query.eq('farmer_id', farmerId);
      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        return data.map(d => ({
          bookingId: d.booking_id,
          token: d.token,
          centreId: d.centre_id,
          commodityId: d.commodity_id,
          quantityKg: d.quantity,
          status: d.status.charAt(0).toUpperCase() + d.status.slice(1),
          queuePosition: d.queue_position,
          predictedWaitMinutes: d.predicted_wait_minutes,
          totalEstimatedAmount: d.total_estimated_amount,
        }));
      }
    } catch (err) {
      console.warn('[KisanFlow] Error fetching farmer bookings from Supabase:', err);
    }
  }

  const stored = getLocal(LOCAL_STORAGE_KEYS.BOOKINGS, []);
  const active = getLocal(LOCAL_STORAGE_KEYS.ACTIVE_BOOKING, INITIAL_ACTIVE_BOOKING);
  return stored.length > 0 ? stored : [active];
};

/**
 * 4. getCentreBookings
 * Fetches today's appointments for a specific procurement centre (used by Operator)
 */
export const getCentreBookings = async (centreId = 'dadri') => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('centre_id', centreId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(d => {
          const comm = COMMODITIES.find(c => c.id === d.commodity_id) || COMMODITIES[0];
          return {
            id: d.id,
            bookingId: d.booking_id,
            token: d.token,
            farmer: 'Ramesh Kumar (Demo User)',
            phone: '+91 98765 43210',
            commodity: comm.name.split(' ')[0],
            quantityKg: Number(d.quantity),
            slot: '11:00 AM - 12:00 PM',
            status: d.status.charAt(0).toUpperCase() + d.status.slice(1),
            vehicle: 'Tractor Trolley (UP 16 AB 4912)',
          };
        });
      }
    } catch (err) {
      console.warn('[KisanFlow] Error fetching centre bookings from Supabase:', err);
    }
  }

  return getLocal(LOCAL_STORAGE_KEYS.OPERATOR_BOOKINGS, OPERATOR_TODAYS_BOOKINGS);
};

/**
 * 5. updateBookingStatus
 * Updates the state of a booking (booked -> arrived -> waiting -> processing -> completed)
 */
export const updateBookingStatus = async (idOrToken, newStatus) => {
  const normStatus = newStatus.toLowerCase();

  if (isSupabaseConfigured() && supabase) {
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrToken);
      let query = supabase.from('bookings').update({ status: normStatus });

      if (isUUID) {
        query = query.eq('id', idOrToken);
      } else if (String(idOrToken).startsWith('KF-')) {
        query = query.eq('booking_id', idOrToken);
      } else if (/^A\d+/i.test(String(idOrToken))) {
        query = query.eq('token', idOrToken);
      } else {
        query = query.or(`booking_id.eq.${idOrToken},token.eq.${idOrToken}`);
      }

      const { error } = await query;

      if (error) {
        console.warn('[KisanFlow] Error updating status in Supabase:', error.message);
      } else {
        console.info(`[KisanFlow] Status updated to "${normStatus}" in Supabase for ${idOrToken}`);
      }
    } catch (err) {
      console.warn('[KisanFlow] Exception updating status in Supabase:', err);
    }
  }

  // Synchronize in local storage cache
  const active = getLocal(LOCAL_STORAGE_KEYS.ACTIVE_BOOKING, INITIAL_ACTIVE_BOOKING);
  if (active && (active.token === idOrToken || active.bookingId === idOrToken || active.id === idOrToken)) {
    const updated = {
      ...active,
      status: newStatus,
      paymentStatus: newStatus === 'Completed' ? 'Successful' : active.paymentStatus,
    };
    setLocal(LOCAL_STORAGE_KEYS.ACTIVE_BOOKING, updated);
  }

  const opBookings = getLocal(LOCAL_STORAGE_KEYS.OPERATOR_BOOKINGS, OPERATOR_TODAYS_BOOKINGS);
  const updatedOp = opBookings.map(b =>
    b.id === idOrToken || b.token === idOrToken || b.bookingId === idOrToken
      ? { ...b, status: newStatus }
      : b
  );
  setLocal(LOCAL_STORAGE_KEYS.OPERATOR_BOOKINGS, updatedOp);

  return true;
};

/**
 * 6. createPayment
 * Records simulated payment for completed procurement
 */
export const createPayment = async (paymentData) => {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('payments').insert([{
        amount: Number(paymentData.amount),
        status: paymentData.status || 'completed',
        transaction_id: paymentData.transactionId,
        payment_mode: paymentData.paymentMode || 'Simulated DBT',
      }]);
    } catch (err) {
      console.warn('[KisanFlow] Error logging payment to Supabase:', err);
    }
  }

  const payments = getLocal(LOCAL_STORAGE_KEYS.PAYMENTS, []);
  setLocal(LOCAL_STORAGE_KEYS.PAYMENTS, [paymentData, ...payments]);
  return paymentData;
};

/**
 * 7. getPayments
 * Fetches payment records
 */
export const getPayments = async (bookingId) => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data } = await supabase.from('payments').select('*').limit(10);
      if (data && data.length > 0) return data;
    } catch (err) {}
  }
  return getLocal(LOCAL_STORAGE_KEYS.PAYMENTS, []);
};

/**
 * 8. createFeedback
 * Stores farmer feedback and rating
 */
export const createFeedback = async (feedbackData) => {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('feedback').insert([{
        rating: feedbackData.rating,
        comment: feedbackData.comment || '',
      }]);
    } catch (err) {
      console.warn('[KisanFlow] Error saving feedback to Supabase:', err);
    }
  }

  const stored = getLocal(LOCAL_STORAGE_KEYS.FEEDBACK, []);
  setLocal(LOCAL_STORAGE_KEYS.FEEDBACK, [feedbackData, ...stored]);
  return feedbackData;
};

/**
 * 9. getRewards
 * Fetches reward points ledger
 */
export const getRewards = async (farmerId) => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data } = await supabase.from('rewards').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) return data;
    } catch (err) {}
  }
  return getLocal(LOCAL_STORAGE_KEYS.REWARDS, REWARDS_HISTORY);
};
