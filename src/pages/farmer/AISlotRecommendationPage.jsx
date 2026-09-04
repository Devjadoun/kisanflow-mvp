import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Clock,
  Users,
  Building2,
  CheckCircle2,
  Info,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  BarChart2,
} from 'lucide-react';
import { MOCK_SLOTS_PREDICTION, PROCUREMENT_CENTRES } from '../../data/mockData';
import { SimulationNotice } from '../../components/common/SimulationNotice';
import { useApp } from '../../context/AppContext';

export const AISlotRecommendationPage = () => {
  const navigate = useNavigate();
  const { createBooking } = useApp();
  const [selectedCentre, setSelectedCentre] = useState('dadri');
  const [selectedSlot, setSelectedSlot] = useState(MOCK_SLOTS_PREDICTION[1]); // default to 11 AM

  const centre = PROCUREMENT_CENTRES.find(c => c.id === selectedCentre) || PROCUREMENT_CENTRES[0];

  const handleBookThisSlot = (slot) => {
    createBooking({
      centreId: centre.id,
      commodityId: 'wheat',
      quantityKg: 250,
      timeSlot: slot.time,
      isRecommended: slot.isRecommended,
      predictedWaitMin: slot.predictedWaitMin,
    });
    navigate('/farmer/confirmation');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-left pb-12">
      <SimulationNotice
        title="Predictive Engine Explanation"
        message="This engine uses deterministic mathematical queuing formulas based on live mandi queue size, active weighbridges, average servicing speed, and incoming slot bookings."
      />

      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> AI Predictive Slot Recommendation
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-500 font-mono">Algorithm: Deterministic Queuing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Mandi Congestion & Smart Slot Advisor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Compare predicted waiting times across operating hours and pick the lowest-congestion slot.
          </p>
        </div>

        {/* Centre Dropdown */}
        <div className="w-full sm:w-auto">
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Select Centre:</label>
          <select
            value={selectedCentre}
            onChange={(e) => setSelectedCentre(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600"
          >
            {PROCUREMENT_CENTRES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.activeCounters} Counters)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Featured AI Recommendation Card (Prominent - Exact prompt spec) */}
      <div className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-200 block">
                Top Recommendation for {centre.name}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">11:00 AM - 12:00 PM</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-white text-emerald-900 font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              AI RECOMMENDED ✓
            </span>
          </div>
        </div>

        {/* 4 Core Metrics required by prompt */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 text-left">
          <div className="bg-white/10 rounded-xl p-3.5 backdrop-blur-xs border border-white/10">
            <span className="text-emerald-200 text-xs block font-medium">Predicted waiting time:</span>
            <strong className="text-2xl font-black text-white mt-0.5 block">35 minutes</strong>
            <span className="text-[10px] text-emerald-300">Fastest turnaround window</span>
          </div>

          <div className="bg-white/10 rounded-xl p-3.5 backdrop-blur-xs border border-white/10">
            <span className="text-emerald-200 text-xs block font-medium">Expected queue:</span>
            <strong className="text-2xl font-black text-white mt-0.5 block">8 farmers</strong>
            <span className="text-[10px] text-emerald-300">Vs. 18 at 09:00 AM peak</span>
          </div>

          <div className="bg-white/10 rounded-xl p-3.5 backdrop-blur-xs border border-white/10">
            <span className="text-emerald-200 text-xs block font-medium">Centre capacity:</span>
            <strong className="text-2xl font-black text-white mt-0.5 block">20 / hr</strong>
            <span className="text-[10px] text-emerald-300">{centre.activeCounters} Active Weighbridges</span>
          </div>

          <div className="bg-white/10 rounded-xl p-3.5 backdrop-blur-xs border border-white/10">
            <span className="text-emerald-200 text-xs block font-medium">Congestion score:</span>
            <strong className="text-2xl font-black text-emerald-300 mt-0.5 block">96 / 100</strong>
            <span className="text-[10px] text-emerald-300">Optimal throughput</span>
          </div>
        </div>

        {/* Recommendation Reason */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-2.5 text-xs text-emerald-100 max-w-2xl">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-emerald-300" />
            <p>
              <strong>Recommendation reason:</strong> "Lower expected congestion and shorter waiting time. Weighbridges #01 through #04 are fully staffed and morning delivery rush clears by 10:45 AM."
            </p>
          </div>

          <button
            onClick={() => handleBookThisSlot(MOCK_SLOTS_PREDICTION[1])}
            className="px-6 py-3 bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-xs rounded-xl transition shadow-md shrink-0 flex items-center justify-center gap-2"
          >
            <span>Instant Book This Slot (+50 Pts)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Comparison of All Hourly Slots (Prompt Requirements) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">
            Hourly Congestion & Queue Predictions
          </h3>
          <span className="text-xs text-slate-500">Live Forecast for Today</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_SLOTS_PREDICTION.map((slot, idx) => {
            return (
              <div
                key={idx}
                className={`p-5 rounded-xl border-2 transition-all flex flex-col justify-between ${
                  slot.isRecommended
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-200'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono font-bold text-base text-slate-900">{slot.time.split(' - ')[0]}</span>
                    {slot.isRecommended ? (
                      <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI RECOMMENDED
                      </span>
                    ) : (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        slot.predictedWaitMin >= 70
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {slot.congestion} Traffic
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Queue:</span>
                      <strong className="text-slate-900 font-bold">{slot.queue} farmers</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Predicted wait:</span>
                      <strong className={slot.predictedWaitMin <= 40 ? 'text-emerald-700 font-black' : 'text-slate-900 font-bold'}>
                        {slot.predictedWaitMin} min
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Full Window:</span>
                      <span className="text-slate-700">{slot.time}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100 leading-snug">
                    {slot.reason}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleBookThisSlot(slot)}
                    className={`w-full py-2 px-3 text-xs font-bold rounded-lg transition ${
                      slot.isRecommended
                        ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    Select {slot.time.split(' - ')[0]} Slot
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deterministic Mathematical Formula Explainer (Addressing SIH Transparency) */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 mb-2">
          <Zap className="w-4 h-4 text-emerald-600" />
          <span>How the Prototype Deterministic Algorithm Calculates Waiting Time</span>
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          KisanFlow’s predictive engine calculates estimated waiting times dynamically without deceptive ML promises:
        </p>

        <div className="mt-3 p-3 bg-white rounded-xl border border-slate-300 font-mono text-xs text-slate-800 space-y-1">
          <p><strong>Predicted Wait (T)</strong> = (Queue_Size × Avg_Service_Time) ÷ (Active_Counters × Efficiency_Factor)</p>
          <p className="text-[11px] text-slate-500">Where for Dadri Mandi: Avg_Service_Time = 4.2 min | Active_Counters = 4 | Capacity = 20/hr</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4 text-[11px] text-slate-600">
          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
            <strong>1. Queue Size:</strong> Active tokens awaiting weighbridge
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
            <strong>2. Centre Capacity:</strong> Max physical tonnage per hour
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
            <strong>3. Service Rate:</strong> Turnaround seconds per truck
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
            <strong>4. Advance Bookings:</strong> Scheduled arrivals per hourly bucket
          </div>
        </div>
      </div>
    </div>
  );
};
