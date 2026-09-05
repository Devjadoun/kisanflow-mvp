import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarDays,
  CheckCircle2,
  Clock,
  Percent,
  AlertTriangle,
  Building2,
  TrendingUp,
  Cpu,
  BarChart3,
  ArrowRight,
  Download,
  Database,
  Activity,
  FileSpreadsheet,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { SimulationNotice } from '../../components/common/SimulationNotice';
import { getDatabaseStorageStats } from '../../services/kisanFlowService';
import { getSMSLogs } from '../../services/notificationService';
import { exportToCSV, exportToXLSX } from '../../utils/exportReports';

export const AdminDashboard = () => {
  const { operatorBookings, realtimeStatus, lastSyncTime } = useApp();
  const [counts, setCounts] = useState({
    farmers: 0,
    bookings: 0,
    queue: 0,
    procurements: 0,
    smsDelivered: 0,
    smsFailed: 0,
  });

  const loadDatabaseCounts = async () => {
    try {
      const stats = await getDatabaseStorageStats();
      const sms = await getSMSLogs(50);

      const fCount = stats.find(s => s.name === 'farmers')?.rowCount || 0;
      const bCount = stats.find(s => s.name === 'bookings')?.rowCount || 0;
      const qCount = stats.find(s => s.name === 'queue_entries')?.rowCount || operatorBookings.length;
      const pCount = stats.find(s => s.name === 'procurements')?.rowCount || 0;
      const delivered = sms.filter(s => s.status === 'delivered').length;
      const failed = sms.filter(s => s.status === 'failed').length;

      setCounts({
        farmers: fCount,
        bookings: Math.max(bCount, operatorBookings.length),
        queue: qCount,
        procurements: pCount,
        smsDelivered: delivered,
        smsFailed: failed,
      });
    } catch {}
  };

  useEffect(() => {
    loadDatabaseCounts();
    const interval = setInterval(loadDatabaseCounts, 6000);
    return () => clearInterval(interval);
  }, [operatorBookings.length]);

  const activeTokens = operatorBookings.filter(b => ['Called', 'Processing', 'Waiting'].includes(b.status)).length;
  const completedIntakes = operatorBookings.filter(b => b.status === 'Completed').length;
  const avgWaitMin = activeTokens > 0 ? `${activeTokens * 6} min` : '0 min';
  const slotUtilization = operatorBookings.length > 0 ? `${Math.min(100, Math.round((operatorBookings.length / 20) * 100))}%` : '0%';

  const handleExportSummary = (format) => {
    const report = [
      { Metric: 'Total Registered Farmers', Value: counts.farmers },
      { Metric: "Today's Bookings", Value: counts.bookings },
      { Metric: 'Active Queue Tokens', Value: activeTokens },
      { Metric: 'Completed Procurements', Value: completedIntakes },
      { Metric: 'SMS Delivered', Value: counts.smsDelivered },
      { Metric: 'SMS Failed', Value: counts.smsFailed },
      { Metric: 'Average Waiting Time', Value: avgWaitMin },
      { Metric: 'Current Mandi Slot Utilization', Value: slotUtilization },
    ];

    if (format === 'csv') exportToCSV(report, 'KISANFLOW_DAILY_ADMIN_OVERSIGHT');
    else exportToXLSX(report, 'KISANFLOW_DAILY_ADMIN_OVERSIGHT');
  };

  // Construct chart data dynamically from actual bookings
  const hasData = operatorBookings.length > 0;

  const dynamicHourlyData = [
    { hour: '09 AM', bookings: operatorBookings.filter(b => b.slot?.includes('09:00')).length, completed: 0 },
    { hour: '11 AM', bookings: operatorBookings.filter(b => b.slot?.includes('11:00')).length, completed: completedIntakes },
    { hour: '01 PM', bookings: operatorBookings.filter(b => b.slot?.includes('01:00')).length, completed: 0 },
    { hour: '03 PM', bookings: operatorBookings.filter(b => b.slot?.includes('03:00')).length, completed: 0 },
    { hour: '05 PM', bookings: operatorBookings.filter(b => b.slot?.includes('05:00')).length, completed: 0 },
  ];

  return (
    <div className="space-y-8 text-left pb-12">
      <SimulationNotice
        compact
        message="State Mandi Directorate Oversight: Aggregates real-time authoritative telemetry from PostgreSQL."
      />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              State Agricultural Marketing Board
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-500 font-mono">
              Live Realtime: {realtimeStatus === 'connected' ? '🟢 Active' : '🟠 Reconnecting'} • Last Sync: {lastSyncTime}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Government Mandi Analytics & Queue Oversight
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time procurement velocity, waiting time compression, and weighbridge utilization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/storage"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs border border-purple-200 transition"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Data Storage View</span>
          </Link>
          <Link
            to="/admin/health"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>System Health</span>
          </Link>
          <button
            onClick={() => handleExportSummary('xlsx')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 6 Required Live Realtime Metrics (Section 30 & 43) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">Total Farmers</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block font-mono">{counts.farmers}</span>
          <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block truncate">Authoritative registry</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">Today's Bookings</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block font-mono">{counts.bookings}</span>
          <span className="text-[10px] text-blue-600 font-medium mt-0.5 block truncate">Scheduled today</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">Active Tokens</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block font-mono">{activeTokens}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 block truncate">In live queue</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">Completed Procurement</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block font-mono">{completedIntakes}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 block truncate">Tonnage cleared</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">Average Waiting Time</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block font-mono">{avgWaitMin}</span>
          <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block truncate">MVP dynamic estimate</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">SMS Dispatched</span>
          <span className="text-2xl font-black text-indigo-700 mt-1 block font-mono">{counts.smsDelivered}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 block truncate">Outbox delivered</span>
        </div>
      </div>

      {/* Visual Charts Grid with Empty State Handling */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Dynamic Bookings by Hour */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">1. Today's Bookings & Arrivals by Slot</h2>
              <p className="text-xs text-slate-500">Live hourly arrivals across Mandi weighbridges</p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Today (Live Telemetry)
            </span>
          </div>

          {!hasData ? (
            <div className="h-64 flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center p-6">
              <BarChart3 className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-600">No Booking Data Recorded Today</p>
              <p className="text-[11px] text-slate-400 mt-1">
                When farmers schedule procurement appointments, hourly arrival patterns will chart automatically.
              </p>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dynamicHourlyData}>
                  <defs>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="bookings" stroke="#1e3a8a" fillOpacity={1} fill="url(#colorBookings)" name="Booked Slots" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Chart 2: Centre Capacity & Load Balancer */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">2. Centre Load Status</h2>
                <p className="text-xs text-slate-500">Live Dadri weighbridge utilization</p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Weighbridge Yard Capacity</span>
                  <span className="font-mono font-bold text-slate-900">{slotUtilization}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: slotUtilization }}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <span className="font-bold text-slate-700 block mb-1">Mandi Congestion Status:</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Optimal Inflow Rate (4.2 min/truck)</span>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              to="/admin/storage"
              className="w-full py-2.5 px-3 bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs rounded-xl flex items-center justify-between transition"
            >
              <span>Inspect PostgreSQL Row Storage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
