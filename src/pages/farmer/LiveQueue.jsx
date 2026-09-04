import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Clock,
  Building2,
  Bell,
  CheckCircle2,
  Truck,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Volume2,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SimulationNotice } from '../../components/common/SimulationNotice';

export const LiveQueue = () => {
  const { activeBooking, queueList, advanceQueue } = useApp();

  // Progress computation
  const totalTokens = queueList.length;
  const completedCount = queueList.filter(q => q.status === 'Completed').length;
  const currentToken = queueList.find(q => q.status === 'Current') || { token: 'A019' };
  const progressPercent = Math.min(100, Math.round((completedCount / (totalTokens - 2)) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left pb-12">
      <SimulationNotice
        compact
        message="Live Digital Mandi Queue (Demo Data): Token alerts simulated for prototype when 3 positions away."
      />

      {/* Main Centre & Token Headline Banner (Exact Prompt Requirements) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
              {activeBooking.centreName || 'DADRI PROCUREMENT CENTRE'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-mono">
              Gate #01 Weighbridge
            </span>
            <button
              onClick={advanceQueue}
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded-lg transition flex items-center gap-1"
              title="Simulate Queue Movement"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Simulate Next Turn</span>
            </button>
          </div>
        </div>

        {/* 4 Big Metric Blocks (Prompt Spec: CURRENTLY SERVING A019, YOUR TOKEN A027, QUEUE POSITION 8, ESTIMATED WAIT 35 MIN) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6 text-center">
          {/* CURRENTLY SERVING */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
              CURRENTLY SERVING
            </span>
            <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono mt-1 block">
              {currentToken.token || 'A019'}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">At Counter #02</span>
          </div>

          {/* YOUR TOKEN */}
          <div className="bg-emerald-950/80 p-4 rounded-2xl border-2 border-emerald-500 shadow-md">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-300 block">
              YOUR TOKEN
            </span>
            <span className="text-3xl sm:text-4xl font-black text-white font-mono mt-1 block">
              {activeBooking.token || 'A027'}
            </span>
            <span className="text-[10px] text-emerald-400 mt-1 block font-semibold">
              {activeBooking.commodityName?.split(' ')[0] || 'Wheat'} • {activeBooking.quantityKg || 250} kg
            </span>
          </div>

          {/* QUEUE POSITION */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
              QUEUE POSITION
            </span>
            <span className="text-3xl sm:text-4xl font-black text-white font-mono mt-1 block">
              {activeBooking.queuePosition}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">Tractors Ahead</span>
          </div>

          {/* ESTIMATED WAIT */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
              ESTIMATED WAIT
            </span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono mt-1 block">
              {activeBooking.predictedWaitMinutes} MIN
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">~4.2 min per farmer</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Overall Slot Progress</span>
            <span className="font-mono text-emerald-400 font-bold">{progressPercent}% Cleared</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Alert Box (Explicit Prompt Requirement) */}
        <div className="mt-6 p-4 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs flex items-center gap-3">
          <Bell className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
          <div>
            <strong className="text-white block">Automated Proximity Notification (Prototype Simulation):</strong>
            <span>"You will receive an alert when you are 3 positions away."</span>
          </div>
        </div>
      </div>

      {/* Live Queue Board (Prompt: A020 Completed, A021 Completed, A022 Completed, A023 Current, A024 Waiting, A025 Waiting, A026 Waiting, A027 YOU) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Live Weighbridge Token Flow</h2>
            <p className="text-xs text-slate-500">Real-time status of vehicles in Dadri Mandi yard</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">11:00 AM - 12:00 PM Slot</span>
        </div>

        <div className="divide-y divide-slate-100">
          {queueList.map((item, idx) => {
            const isUser = item.token === activeBooking.token || item.isUser;
            const isCompleted = item.status === 'Completed';
            const isCurrent = item.status === 'Current' || item.status.includes('Current');

            return (
              <div
                key={idx}
                className={`py-3.5 px-4 flex items-center justify-between rounded-xl transition-all ${
                  isUser
                    ? 'bg-emerald-600 text-white font-bold shadow-md my-1'
                    : isCurrent
                    ? 'bg-amber-50 border border-amber-200 text-amber-950 font-semibold'
                    : isCompleted
                    ? 'opacity-60 bg-slate-50/50'
                    : 'hover:bg-slate-50'
                }`}
              >
                {/* Left: Token & Farmer */}
                <div className="flex items-center gap-3">
                  <span className={`text-base font-mono font-black px-2.5 py-1 rounded-lg ${
                    isUser
                      ? 'bg-white text-emerald-900'
                      : isCurrent
                      ? 'bg-amber-500 text-slate-950'
                      : isCompleted
                      ? 'bg-slate-200 text-slate-600'
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    {item.token}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">
                        {isUser ? `${item.farmer} (YOU)` : item.farmer}
                      </span>
                      {isUser && (
                        <span className="text-[10px] bg-white text-emerald-900 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                          YOUR TOKEN
                        </span>
                      )}
                    </div>
                    <span className={`text-xs ${isUser ? 'text-emerald-100' : 'text-slate-500'}`}>
                      {item.commodity} • {item.qty}
                    </span>
                  </div>
                </div>

                {/* Right: Status Badge */}
                <div className="flex items-center gap-4 text-xs">
                  <span className={`hidden sm:inline ${isUser ? 'text-emerald-100' : 'text-slate-500'}`}>
                    {item.counter}
                  </span>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    isUser
                      ? 'bg-white text-emerald-900'
                      : isCurrent
                      ? 'bg-amber-100 text-amber-900 ring-2 ring-amber-400 animate-pulse'
                      : isCompleted
                      ? 'bg-slate-100 text-slate-500'
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    {isUser ? 'YOU' : item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Keep Aadhaar card and tractor registration handy for gate verification.</span>
        </div>

        <Link
          to="/farmer/procurement"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
        >
          <span>View Next Step: Procurement Status</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
