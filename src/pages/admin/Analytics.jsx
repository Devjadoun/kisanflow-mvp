import React from 'react';
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Users,
  Building2,
  Scale,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { WAITING_TIME_TREND_DATA, HOURLY_BOOKINGS_DATA } from '../../data/mockData';
import { SimulationNotice } from '../../components/common/SimulationNotice';

export const Analytics = () => {
  return (
    <div className="space-y-6 text-left pb-12">
      <SimulationNotice
        compact
        message="Mandi Operations Analytics: Quantitative evidence of wait-time reduction for SIH 2026 jury evaluation."
      />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          Impact Evaluation
        </span>
        <h1 className="text-2xl font-black text-slate-900 mt-1">
          Procurement Velocity & Wait-Time Analytics
        </h1>
        <p className="text-xs text-slate-500">
          Comparing traditional walk-in queues against KisanFlow scheduled smart slots.
        </p>
      </div>

      {/* Key Metric Highlight */}
      <div className="bg-gradient-to-br from-emerald-800 to-slate-900 text-white rounded-3xl p-8 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
              Key Impact Metric
            </span>
            <div className="text-5xl font-black text-white mt-1 font-mono flex items-baseline gap-2">
              <span>79.1%</span>
              <TrendingDown className="w-8 h-8 text-emerald-400" />
            </div>
            <p className="text-xs text-emerald-200 mt-1">Average Wait Time Reduction</p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
            <span className="text-xs text-slate-300 block">Baseline Unscheduled Mandi:</span>
            <strong className="text-3xl font-black text-red-300 font-mono block mt-1">
              185 Minutes
            </strong>
            <span className="text-[11px] text-slate-400">Farmers waited over 3 hours on tractors</span>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
            <span className="text-xs text-slate-300 block">With KisanFlow Smart Slots:</span>
            <strong className="text-3xl font-black text-emerald-400 font-mono block mt-1">
              35 Minutes
            </strong>
            <span className="text-[11px] text-emerald-200">Guaranteed weighbridge window</span>
          </div>
        </div>
      </div>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waiting time trend */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-1">
            Weekly Wait Time Trend (Before vs After)
          </h2>
          <p className="text-xs text-slate-500 mb-4">Minutes spent in queue per tractor consignment</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WAITING_TIME_TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit="m" />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="beforeKisanFlow" stroke="#dc2626" strokeWidth={2} name="Unscheduled Walk-in (mins)" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="afterKisanFlow" stroke="#059669" strokeWidth={3} name="KisanFlow Smart Slot (mins)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Queue Clear Rate */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-1">
            Hourly Completed Procurement Throughput
          </h2>
          <p className="text-xs text-slate-500 mb-4">Consignments weighed and cleared per hour</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_BOOKINGS_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="completed" fill="#1e3a8a" radius={[4, 4, 0, 0]} name="Completed Consignments" />
                <Bar dataKey="bookings" fill="#93c5fd" radius={[4, 4, 0, 0]} name="Scheduled Slots" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
