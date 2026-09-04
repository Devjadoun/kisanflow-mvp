import React from 'react';
import {
  Cpu,
  Sparkles,
  Database,
  Truck,
  Gauge,
  Users,
  CalendarX,
  Layers,
  ArrowDown,
  Info,
  Clock,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  AI_PIPELINE_STEPS,
  TOMORROW_DEMAND_FORECAST,
} from '../../data/mockData';
import { SimulationNotice } from '../../components/common/SimulationNotice';

export const AIPredictions = () => {
  return (
    <div className="space-y-8 text-left pb-12">
      <SimulationNotice
        title="Prototype Prediction Engine Disclaimer"
        message="This is a prototype prediction engine using demo data and deterministic queuing heuristics for Smart India Hackathon 2026. No claim of proprietary neural net training is made."
      />

      {/* Header (Page Title exact prompt requirement: AI & Predictive Analytics) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" /> Mandi Intelligent Core
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-500 font-mono">Model: Deterministic Queue Heuristics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            AI & Predictive Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Forecasting arrival surges, dynamically adjusting slot capacities, and preventing mandi gridlocks.
          </p>
        </div>

        <div className="text-xs font-mono bg-purple-50 text-purple-800 px-3 py-1.5 rounded-lg border border-purple-200">
          Status: Heuristic Model Active
        </div>
      </div>

      {/* Conceptual Pipeline (Exact Prompt Specification:
          Historical Data
          ↓
          Farmer Arrivals
          ↓
          Service Rate
          ↓
          Queue Length
          ↓
          No-show Patterns
          ↓
          Prediction Engine
          ↓
          Recommended Slots) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
            Conceptual Prediction Pipeline
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-2">
            How the Predictive Slot Engine Works
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Data streams ingest historical patterns and real-time mandi telemetry to recommend optimal arrival windows.
          </p>
        </div>

        {/* Pipeline visual cards with arrows */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2">
          {AI_PIPELINE_STEPS.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex-1 w-full p-4 rounded-xl border border-slate-200 bg-slate-50/70 text-center flex flex-col items-center justify-center hover:border-purple-400 transition hover:bg-white shadow-2xs">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold flex items-center justify-center mb-1.5 font-mono">
                  {step.id}
                </span>
                <h3 className="font-bold text-xs text-slate-900">{step.title}</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight line-clamp-2">{step.desc}</p>
              </div>

              {idx < AI_PIPELINE_STEPS.length - 1 && (
                <div className="text-purple-600 font-bold my-1 lg:my-0 shrink-0">
                  <span className="hidden lg:inline text-lg">➔</span>
                  <span className="lg:hidden text-lg">↓</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Tomorrow's Expected Demand Chart (Prompt Requirement) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Tomorrow's Expected Demand Forecast
            </h2>
            <p className="text-xs text-slate-500">
              Hourly arrival demand forecast vs mandi physical capacity (40 vehicles/hr limit across 4 weighbridges).
            </p>
          </div>
          <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full font-bold">
            Peak Expected: 10:00 AM - 12:00 PM
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TOMORROW_DEMAND_FORECAST}>
              <defs>
                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} unit=" veh" />
              <Tooltip />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Area type="monotone" dataKey="demand" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorDemand)" name="Expected Demand (Trucks)" />
              <Area type="monotone" dataKey="capacity" stroke="#dc2626" strokeWidth={2} strokeDasharray="4 4" fill="none" name="Physical Capacity Threshold" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sample Recommendation Box (Exact Prompt Specification:
          Peak Expected Demand: 10:00 AM - 12:00 PM
          Recommended additional slots: 4
          Expected average waiting: 42 minutes) */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/20">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/20 text-amber-300">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs uppercase tracking-widest text-purple-300 block font-mono">
                Prescriptive Mandi Action
              </span>
              <h3 className="text-xl font-bold">Recommended Slot Adjustments for Tomorrow</h3>
            </div>
          </div>
          <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full font-mono">
            Dadri Mandi Samiti
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-left">
          {/* Peak Expected Demand */}
          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
            <span className="text-xs text-purple-200 block font-medium">Peak Expected Demand:</span>
            <strong className="text-2xl font-black text-amber-300 font-mono mt-1 block">
              10:00 AM - 12:00 PM
            </strong>
            <span className="text-[10px] text-purple-200 mt-1 block">Surge factor: 2.4x baseline</span>
          </div>

          {/* Recommended additional slots */}
          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
            <span className="text-xs text-purple-200 block font-medium">Recommended additional slots:</span>
            <strong className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
              4 Slots
            </strong>
            <span className="text-[10px] text-purple-200 mt-1 block">Shift buffer weighbridge #04</span>
          </div>

          {/* Expected average waiting */}
          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
            <span className="text-xs text-purple-200 block font-medium">Expected average waiting:</span>
            <strong className="text-2xl font-black text-white font-mono mt-1 block">
              42 minutes
            </strong>
            <span className="text-[10px] text-purple-200 mt-1 block">If rebalancing is implemented</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-purple-200">
          <span>*Generated by KisanFlow Prototype Engine using demo heuristics</span>
          <span className="font-semibold text-emerald-300">Confidence Index: 89.4%</span>
        </div>
      </div>
    </div>
  );
};
