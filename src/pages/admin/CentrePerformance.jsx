import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Percent,
  Clock,
  Scale,
  Users,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { CENTRE_PERFORMANCE_LIST } from '../../data/mockData';
import { SimulationNotice } from '../../components/common/SimulationNotice';

export const CentrePerformance = () => {
  return (
    <div className="space-y-6 text-left pb-12">
      <SimulationNotice
        compact
        message="Mandi Throughput & Load Balancing: Identifies congested versus under-utilized centres across the procurement cluster."
      />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Infrastructure Benchmarking
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Centre Performance Analysis</h1>
          <p className="text-xs text-slate-500">
            Compare weighbridge utilization rates and service turnaround across all 4 mandis.
          </p>
        </div>

        <Link
          to="/admin/predictions"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition"
        >
          <span>AI Load Balancer</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Performance Cards (Prompt Requirements: Centre A 91%, Centre B 84%, Centre C 76%, Centre D 68%) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CENTRE_PERFORMANCE_LIST.map((centre, idx) => {
          const isDadri = centre.utilization === 91;
          const isBulandshahr = centre.utilization === 68;

          return (
            <div
              key={idx}
              className={`bg-white rounded-2xl p-6 border-2 transition-all flex flex-col justify-between ${
                isDadri
                  ? 'border-emerald-500 shadow-md ring-1 ring-emerald-200'
                  : isBulandshahr
                  ? 'border-amber-300 shadow-xs'
                  : 'border-slate-200 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    CODE: {centre.code}
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    centre.utilization >= 85
                      ? 'bg-emerald-100 text-emerald-800'
                      : centre.utilization >= 75
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {centre.status}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900">{centre.name}</h2>

                {/* Big Utilization Stat */}
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Slot Utilization</span>
                    <span className="text-3xl font-black font-mono text-slate-900">
                      {centre.utilization}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Average Wait</span>
                    <span className="text-xl font-bold font-mono text-emerald-700">
                      {centre.avgWait} min
                    </span>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-xs text-slate-600">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Today Procured</span>
                    <strong className="text-slate-900">{centre.todayProcuredMT} MT</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Active Weighbridges</span>
                    <strong className="text-slate-900">{centre.activeCounters} Scales</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Farmer Rating</span>
                    <strong className="text-amber-600">{centre.rating} ★</strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">No-show Rate: <strong>{centre.noShowRate}%</strong></span>
                <span className="text-[11px] font-semibold text-purple-700">
                  {isDadri ? 'Optimal queue throughput' : isBulandshahr ? 'Opportunity to add 4 slots' : 'Steady procurement flow'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Balancing Recommendation */}
      <div className="p-5 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-950 flex items-start gap-3">
        <Building2 className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-slate-900 block mb-1">
            District Load Rebalancing Strategy:
          </strong>
          <p className="text-slate-600 leading-relaxed">
            Bulandshahr Central Mandi is currently running at 68% utilization with 6 active weighbridges, while Dadri operates at 91%. KisanFlow’s AI recommendation engine automatically nudges farmers from border villages (such as Sikandrabad tehsil) toward Bulandshahr by offering +50 Kisan Reward bonus points, balancing queue wait times to under 35 minutes across all centers.
          </p>
        </div>
      </div>
    </div>
  );
};
