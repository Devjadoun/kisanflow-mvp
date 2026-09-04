import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Percent,
  Play,
  UserCheck,
  Building2,
  Volume2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { SimulationNotice } from '../../components/common/SimulationNotice';

export const OperatorDashboard = () => {
  const {
    operatorBookings,
    updateOperatorBookingStatus,
    advanceQueue,
    playAlertSound,
  } = useApp();

  // Prompt specified statistics:
  // Today's Bookings: 124, Farmers Arrived: 78, Currently Waiting: 23, Completed: 61, Average Waiting Time: 37 min, Slot Utilization: 82%
  const stats = [
    { title: "Today's Bookings", val: '124', icon: Users, color: 'blue', sub: 'Across 6 operating slots' },
    { title: 'Farmers Arrived', val: '78', icon: UserCheck, color: 'emerald', sub: 'Gate entry scanned' },
    { title: 'Currently Waiting', val: '23', icon: Clock, color: 'amber', sub: 'In mandi holding yard' },
    { title: 'Completed', val: '61', icon: CheckCircle2, color: 'emerald', sub: 'Weighed & simulated DBT logged' },
    { title: 'Average Waiting Time', val: '37 min', icon: Clock, color: 'slate', sub: 'Down from 185m baseline' },
    { title: 'Slot Utilization', val: '82%', icon: Percent, color: 'blue', sub: 'Capacity: 20 trucks/hr' },
  ];

  return (
    <div className="space-y-6 text-left pb-12">
      <SimulationNotice
        compact
        message="Mandi Operator Workstation (Demo Mode): Live intake desk for Dadri Procurement Mandi. Actions update the farmer's live queue instantaneously."
      />

      {/* Operator Header Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Mandi Control Desk
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-500 font-mono">Counter #01 - Weighbridge Yard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Dadri Procurement Centre Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Superintendent: Suresh Chandra • Operational Hours: 08:00 AM - 06:00 PM
          </p>
        </div>

        {/* Global Action: Call Next Farmer */}
        <div className="flex items-center gap-2">
          <button
            onClick={advanceQueue}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-700/20 transition"
          >
            <Volume2 className="w-4 h-4" />
            <span>Call Next Farmer (Chime)</span>
          </button>
        </div>
      </div>

      {/* 6 Statistics Cards (Exact Prompt Requirements) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
              {s.title}
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block font-mono">
              {s.val}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
              {s.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Today's Queue & Bookings Table (Exact Prompt Specification: Token | Farmer | Commodity | Quantity | Slot | Status | Action) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Live Mandi Queue & Gate Registry
            </h2>
            <p className="text-xs text-slate-500">
              Update farmer stage to advance weighbridge intake and simulate prototype notifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/operator/queue"
              className="text-xs font-bold text-blue-700 hover:text-blue-900 px-3 py-1.5 rounded-lg bg-blue-50"
            >
              Full Screen Queue Board →
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Token</th>
                <th className="p-3">Farmer</th>
                <th className="p-3">Commodity</th>
                <th className="p-3 text-right">Quantity</th>
                <th className="p-3">Slot</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {operatorBookings.map((b) => {
                const isProcessing = b.status === 'Processing';
                const isCompleted = b.status === 'Completed';
                const isWaiting = b.status === 'Waiting';
                const isArrived = b.status === 'Arrived';
                const isNoShow = b.status === 'No-show';
                const isBooked = b.status === 'Booked';

                return (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3 font-mono font-black text-sm text-slate-900">
                      <span className="px-2 py-1 bg-slate-100 rounded text-slate-800">
                        {b.token}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{b.farmer}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{b.phone} • {b.vehicle}</span>
                    </td>
                    <td className="p-3 font-medium text-slate-700">
                      {b.commodity}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-800">
                      {b.quantityKg} kg
                    </td>
                    <td className="p-3 text-slate-600 font-mono text-[11px]">
                      {b.slot}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isProcessing
                          ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-400 animate-pulse'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isWaiting
                          ? 'bg-blue-100 text-blue-800'
                          : isArrived
                          ? 'bg-purple-100 text-purple-800'
                          : isNoShow
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {/* Action buttons (Call Next Farmer, Mark Arrived, Start Procurement, Complete Procurement, Mark No-show) */}
                      <div className="inline-flex items-center gap-1">
                        {isBooked && (
                          <button
                            onClick={() => updateOperatorBookingStatus(b.id, 'Arrived')}
                            className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[11px]"
                          >
                            Mark Arrived
                          </button>
                        )}
                        {isArrived && (
                          <button
                            onClick={() => updateOperatorBookingStatus(b.id, 'Processing')}
                            className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px]"
                          >
                            Start Procurement
                          </button>
                        )}
                        {isWaiting && (
                          <button
                            onClick={() => updateOperatorBookingStatus(b.id, 'Processing')}
                            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px]"
                          >
                            Call Next Farmer
                          </button>
                        )}
                        {isProcessing && (
                          <button
                            onClick={() => updateOperatorBookingStatus(b.id, 'Completed')}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px]"
                          >
                            Complete Procurement
                          </button>
                        )}
                        {!isCompleted && !isNoShow && (
                          <button
                            onClick={() => updateOperatorBookingStatus(b.id, 'No-show')}
                            className="px-2 py-1 rounded border border-slate-300 hover:bg-red-50 hover:text-red-700 text-slate-500 text-[10px]"
                            title="Mark as No-show"
                          >
                            No-show
                          </button>
                        )}
                        {isCompleted && (
                          <span className="text-emerald-700 font-bold text-[11px]">✓ Settled</span>
                        )}
                        {isNoShow && (
                          <span className="text-red-700 font-bold text-[11px]">Flagged</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
