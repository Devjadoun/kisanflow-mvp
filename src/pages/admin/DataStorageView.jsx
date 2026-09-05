import React, { useState, useEffect } from 'react';
import {
  Database,
  Layers,
  Server,
  ArrowDown,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Radio,
  FileSpreadsheet,
} from 'lucide-react';
import { getDatabaseStorageStats } from '../../services/kisanFlowService';
import { isSMSProviderConfigured } from '../../services/notificationService';
import { exportToCSV, exportToXLSX } from '../../utils/exportReports';

export const DataStorageView = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState('');

  const isRealSMS = isSMSProviderConfigured();

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getDatabaseStorageStats();
      setStats(data);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('Error fetching database storage statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Live poll every 10s
    return () => clearInterval(interval);
  }, []);

  const getCount = (tableName) => {
    const item = stats.find(s => s.name === tableName);
    return item ? item.rowCount : 0;
  };

  const handleExportSummary = (format) => {
    const reportData = stats.map(s => ({
      'Entity Name': s.label,
      'PostgreSQL Table': s.name,
      'Category': s.category,
      'Live Row Count': s.rowCount,
      'Storage Status': s.status,
    }));

    if (format === 'csv') {
      exportToCSV(reportData, 'KISANFLOW_DATA_STORAGE_AUDIT');
    } else {
      exportToXLSX(reportData, 'KISANFLOW_DATA_STORAGE_AUDIT');
    }
  };

  return (
    <div className="space-y-8 text-left pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              PostgreSQL / Supabase Authoritative Storage
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-500 font-mono">Last Queried: {lastRefreshed || 'Loading...'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Data Storage & System Architecture Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Transparently illustrates where every KisanFlow record is persisted in PostgreSQL with live row counts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            <span>Refresh Counts</span>
          </button>
          <button
            onClick={() => handleExportSummary('xlsx')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Storage Audit (XLSX)</span>
          </button>
        </div>
      </div>

      {/* Infrastructure Transparency Grid (No Fake Claims - Section 29 & 44) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Database Engine</span>
          <span className="text-base font-black text-slate-900 mt-1 block">PostgreSQL</span>
          <span className="text-[10px] text-emerald-700 font-bold mt-0.5 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Supabase Authoritative
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Realtime Pipeline</span>
          <span className="text-base font-black text-slate-900 mt-1 block">Supabase Realtime</span>
          <span className="text-[10px] text-blue-700 font-bold mt-0.5 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            WebSocket Channel Active
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Authentication</span>
          <span className="text-base font-black text-slate-900 mt-1 block">Phone OTP & Roles</span>
          <span className="text-[10px] text-emerald-700 font-bold mt-0.5 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Session Verification Active
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SMS Gateway</span>
          <span className="text-base font-black text-slate-900 mt-1 block">{isRealSMS ? 'Telecom Gateway' : 'Demo SMS Mode'}</span>
          <span className={`text-[10px] font-bold mt-0.5 inline-flex items-center gap-1 ${isRealSMS ? 'text-emerald-700' : 'text-amber-700'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isRealSMS ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            {isRealSMS ? 'Live Gateway Connected' : 'Simulated Outbox'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Redis Cache</span>
          <span className="text-base font-black text-slate-500 mt-1 block">Not Configured</span>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            Postgres is Sole Truth
          </span>
        </div>
      </div>

      {/* Visual Data Flow Hierarchy Diagram (Section 29) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600" />
          <span>PostgreSQL Relational Flow & Table Lineage</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Group 1: Registration */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">1. Farmer Registration Flow</span>
            <div className="mt-3 space-y-2">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-800">public.profiles</span>
                  <p className="text-[11px] text-slate-500">Core user accounts & roles</p>
                </div>
                <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{getCount('profiles')} rows</span>
              </div>
              <div className="text-center text-slate-400 text-xs">↓ references (profile_id)</div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-800">public.farmers</span>
                  <p className="text-[11px] text-slate-500">Village, district & agricultural profile</p>
                </div>
                <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{getCount('farmers')} rows</span>
              </div>
            </div>
          </div>

          {/* Group 2: Booking & Queue */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">2. Booking & Smart Queue Flow</span>
            <div className="mt-3 space-y-2">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-blue-800">public.bookings</span>
                  <p className="text-[11px] text-slate-500">Appointments, tokens & quantities</p>
                </div>
                <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{getCount('bookings')} rows</span>
              </div>
              <div className="text-center text-slate-400 text-xs">↓ triggers entry in</div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-blue-800">public.queue_entries</span>
                  <p className="text-[11px] text-slate-500">Dynamic queue positions & gates</p>
                </div>
                <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{getCount('queue_entries')} rows</span>
              </div>
            </div>
          </div>

          {/* Group 3: Procurement & DBT Payment */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">3. Procurement & DBT Settlement</span>
            <div className="mt-3 space-y-2">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-purple-800">public.procurements</span>
                  <p className="text-[11px] text-slate-500">Gross/tare weighbridge records & moisture</p>
                </div>
                <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{getCount('procurements')} rows</span>
              </div>
              <div className="text-center text-slate-400 text-xs">↓ triggers DBT disbursement</div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-purple-800">public.payments</span>
                  <p className="text-[11px] text-slate-500">Simulated DBT bank transfer receipts</p>
                </div>
                <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{getCount('payments')} rows</span>
              </div>
            </div>
          </div>

          {/* Group 4: Notifications & SMS */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">4. Communications & SMS Pipeline</span>
            <div className="mt-3 space-y-2">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-amber-800">public.notifications</span>
                  <p className="text-[11px] text-slate-500">In-app push alerts & announcements</p>
                </div>
                <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{getCount('notifications')} rows</span>
              </div>
              <div className="text-center text-slate-400 text-xs">↓ dispatches outbox</div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-amber-800">public.sms_logs</span>
                  <p className="text-[11px] text-slate-500">Idempotent SMS logs & delivery status</p>
                </div>
                <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{getCount('sms_logs')} rows</span>
              </div>
            </div>
          </div>

          {/* Group 5: Event Ledger & Audit Trail */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">5. Distributed Event & Audit Ledger</span>
            <div className="mt-3 space-y-2">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-indigo-800">public.event_logs</span>
                  <p className="text-[11px] text-slate-500">Immutable system state transition events</p>
                </div>
                <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{getCount('event_logs')} rows</span>
              </div>
              <div className="text-center text-slate-400 text-xs">↓ operational compliance</div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-indigo-800">public.audit_logs</span>
                  <p className="text-[11px] text-slate-500">Administrative operator actions audit trail</p>
                </div>
                <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{getCount('audit_logs')} rows</span>
              </div>
            </div>
          </div>

          {/* Group 6: Citizen Feedback & Loyalty */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">6. Citizen Feedback & Loyalty</span>
            <div className="mt-3 space-y-2">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-teal-800">public.feedback</span>
                  <p className="text-[11px] text-slate-500">Farmer Mandi ratings & suggestions</p>
                </div>
                <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{getCount('feedback')} rows</span>
              </div>
              <div className="text-center text-slate-400 text-xs">↓ awards points</div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-teal-800">public.rewards</span>
                  <p className="text-[11px] text-slate-500">Kisan reward points ledger</p>
                </div>
                <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{getCount('rewards')} rows</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete PostgreSQL Database Entities Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            All 15 PostgreSQL Entities — Live Telemetry
          </h3>
          <span className="text-xs text-slate-500 font-mono">Live PostgreSQL Instance</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Entity / Category</th>
                <th className="py-3 px-4 font-mono">Table Name</th>
                <th className="py-3 px-4 text-right">Row Count</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.map((row) => (
                <tr key={row.name} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{row.label}</span>
                    <span className="text-[10px] text-slate-400">{row.category}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-800 font-semibold">
                    public.{row.name}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-black text-sm text-slate-900">
                    {row.rowCount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      Authoritative
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
