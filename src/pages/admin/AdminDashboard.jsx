import React from 'react';
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
import {
  ADMIN_STATS,
  HOURLY_BOOKINGS_DATA,
  WAITING_TIME_TREND_DATA,
  CENTRE_PERFORMANCE_LIST,
  COMMODITY_DEMAND_DISTRIBUTION,
  NO_SHOW_TREND_DATA,
} from '../../data/mockData';
import { StatCard } from '../../components/common/StatCard';
import { SimulationNotice } from '../../components/common/SimulationNotice';

export const AdminDashboard = () => {
  return (
    <div className="space-y-8 text-left pb-12">
      <SimulationNotice
        compact
        message="State Mandi Directorate Oversight: Aggregates real-time telemetry across 4 regional procurement centres."
      />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              State Agricultural Marketing Board
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-500 font-mono">Region: Gautam Buddha Nagar & Bulandshahr</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Government Mandi Analytics & Queue Oversight
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time procurement velocity, waiting time compression, and weighbridge utilization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/predictions"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition"
          >
            <Cpu className="w-4 h-4" />
            <span>AI Predictive Engine</span>
          </Link>
        </div>
      </div>

      {/* 6 Required Admin Stats:
          Total Farmers: 14,820
          Today's Bookings: 1,450
          Completed Procurement: 1,120
          Average Waiting Time: 34 min
          Slot Utilization: 86%
          No-show Rate: 4.2% */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">Total Farmers</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block font-mono">{ADMIN_STATS.totalRegisteredFarmers}</span>
          <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block truncate">+340 this week</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">Today's Bookings</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block font-mono">{ADMIN_STATS.todaysTotalBookings}</span>
          <span className="text-[10px] text-blue-600 font-medium mt-0.5 block truncate">Across 4 mandis</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">Completed Procurement</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block font-mono">{ADMIN_STATS.completedProcurementQty}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 block truncate">Tonnage cleared</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">Average Waiting Time</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block font-mono">{ADMIN_STATS.averageWaitingTimeMin}</span>
          <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block truncate">Down from 185 min</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">Slot Utilization</span>
          <span className="text-2xl font-black text-purple-700 mt-1 block font-mono">{ADMIN_STATS.averageSlotUtilization}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 block truncate">High efficiency</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">No-show Rate</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block font-mono">{ADMIN_STATS.noShowRatePercent}</span>
          <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block truncate">Dropped from 19.5%</span>
        </div>
      </div>

      {/* 5 Recharts Models Required by Prompt:
          1. Bookings by hour
          2. Average waiting time
          3. Centre utilization
          4. Commodity demand
          5. No-show rate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Bookings by Hour (AreaChart) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">1. Bookings & Arrivals by Hour</h2>
              <p className="text-xs text-slate-500">Hourly traffic distribution across all active weighbridges</p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Today (08 AM - 05 PM)
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_BOOKINGS_DATA}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorArrivals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="bookings" stroke="#1e3a8a" fillOpacity={1} fill="url(#colorBookings)" name="Scheduled Slots" />
                <Area type="monotone" dataKey="arrivals" stroke="#059669" fillOpacity={1} fill="url(#colorArrivals)" name="Actual Arrivals" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Commodity Demand (Donut / Pie Chart) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">4. Commodity Demand</h2>
              <p className="text-xs text-slate-500">Volume share by crop type</p>
            </div>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={COMMODITY_DEMAND_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {COMMODITY_DEMAND_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}% Share`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
            {COMMODITY_DEMAND_DISTRIBUTION.map((c, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-slate-600 truncate">{c.name}: <strong>{c.value}%</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Average Waiting Time (Line Chart) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">2. Average Waiting Time Trend</h2>
              <p className="text-xs text-slate-500">Historical queue time: Traditional Mandi vs KisanFlow</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              -79% Wait Time
            </span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WAITING_TIME_TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit="m" />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="beforeKisanFlow" stroke="#dc2626" strokeWidth={2} name="Before KisanFlow (mins)" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="afterKisanFlow" stroke="#059669" strokeWidth={3} name="After KisanFlow (mins)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: No-show Rate Over Time (Line Chart) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">5. Farmer No-show Rate Over Months</h2>
              <p className="text-xs text-slate-500">Projected decline modeled on automated slot alerts and AI scheduling flexibility (Simulation)</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Current: 4.2%
            </span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={NO_SHOW_TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit="%" />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#7c3aed" strokeWidth={3} name="No-show Rate (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 3 & Centre Performance (Exact Prompt Requirement)
          Centre A: 91% utilization
          Centre B: 84%
          Centre C: 76%
          Centre D: 68% */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              3. Centre Performance & Capacity Utilization
            </h2>
            <p className="text-xs text-slate-500">
              Benchmarking across regional mandis to identify bottlenecks and balance queue loads.
            </p>
          </div>

          <Link
            to="/admin/centres"
            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
          >
            <span>Detailed Centre Diagnostics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Centre A: 91% utilization */}
          <div className="p-5 rounded-xl border-2 border-emerald-500 bg-emerald-50/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800">Centre A (Dadri Mandi)</span>
              <span className="text-xs font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">Optimal</span>
            </div>
            <div className="text-3xl font-black text-emerald-800 font-mono mt-2">
              91%
            </div>
            <span className="text-xs text-slate-500 block mt-0.5">Utilization Rate</span>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '91%' }}></div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Avg Wait: 35 min • 4 Counters</p>
          </div>

          {/* Centre B: 84% */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Centre B (Greater Noida)</span>
              <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Good</span>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono mt-2">
              84%
            </div>
            <span className="text-xs text-slate-500 block mt-0.5">Utilization Rate</span>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '84%' }}></div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Avg Wait: 38 min • 5 Counters</p>
          </div>

          {/* Centre C: 76% */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Centre C (Sikandrabad)</span>
              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">Moderate</span>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono mt-2">
              76%
            </div>
            <span className="text-xs text-slate-500 block mt-0.5">Utilization Rate</span>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-slate-700 h-2 rounded-full" style={{ width: '76%' }}></div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Avg Wait: 29 min • 3 Counters</p>
          </div>

          {/* Centre D: 68% */}
          <div className="p-5 rounded-xl border border-amber-300 bg-amber-50/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">Centre D (Bulandshahr)</span>
              <span className="text-xs font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">Under-Utilized</span>
            </div>
            <div className="text-3xl font-black text-amber-900 font-mono mt-2">
              68%
            </div>
            <span className="text-xs text-slate-500 block mt-0.5">Utilization Rate</span>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-amber-600 h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Avg Wait: 44 min • 6 Counters</p>
          </div>
        </div>
      </div>
    </div>
  );
};
