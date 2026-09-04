import React from 'react';
import {
  Users,
  Volume2,
  Play,
  CheckCircle2,
  Clock,
  Building2,
  Sparkles,
  AlertCircle,
  Truck,
  Scale,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SimulationNotice } from '../../components/common/SimulationNotice';

export const LiveQueueManagement = () => {
  const { queueList, advanceQueue, playAlertSound, activeBooking } = useApp();

  const currentToken = queueList.find(q => q.status === 'Current') || { token: 'A023', farmer: 'Mahesh Sharma', commodity: 'Wheat' };

  return (
    <div className="space-y-6 text-left pb-12">
      <SimulationNotice
        compact
        message="Live Queue Terminal: Connected to physical LED display boards at Dadri Mandi Samiti Gate #01."
      />

      {/* Control Strip */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Gate #01 Weighbridge Terminal
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Live Queue Management</h1>
          <p className="text-xs text-slate-500">
            Summon next vehicle, broadcast gate audio, and manage yard holding area.
          </p>
        </div>

        <button
          onClick={advanceQueue}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition"
        >
          <Volume2 className="w-5 h-5" />
          <span>Call Next Token (Audio Chime)</span>
        </button>
      </div>

      {/* LED Display Board Simulator */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border-4 border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">
              MANDI PUBLIC ANNOUNCEMENT DISPLAY • GATE 01
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">STATUS: BROADCASTING</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Active Calling Box */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-1">
              CURRENT TOKEN AT WEIGHBRIDGE
            </span>
            <div className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-white my-2">
              {currentToken.token}
            </div>
            <p className="text-base font-bold text-slate-200">{currentToken.farmer}</p>
            <p className="text-xs text-slate-400 mt-0.5">{currentToken.commodity} • {currentToken.qty || '200 kg'}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              Proceed to Weighbridge 2
            </div>
          </div>

          {/* Quick Stats Column */}
          <div className="space-y-4">
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Upcoming Next:</span>
                <span className="text-2xl font-black font-mono text-white">A024</span>
                <span className="text-xs text-slate-400 block">Virender Bhati (Gate 1 Holding)</span>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-md">Queue #2</span>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Demo Farmer Token:</span>
                <span className="text-2xl font-black font-mono text-emerald-400">{activeBooking.token}</span>
                <span className="text-xs text-slate-400 block">Ramesh Kumar (Position #{activeBooking.queuePosition})</span>
              </div>
              <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-md">
                Alert Active
              </span>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Vehicles in Mandi Yard:</span>
              <span className="font-bold text-white font-mono text-sm">23 Vehicles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Queue Token List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4">Complete Sequence of Yard Tokens</h2>
        <div className="divide-y divide-slate-100">
          {queueList.map((item, idx) => (
            <div key={idx} className="py-3 px-3 flex items-center justify-between hover:bg-slate-50 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono font-black text-sm bg-slate-100 px-2 py-1 rounded text-slate-800">
                  {item.token}
                </span>
                <div>
                  <span className="font-bold text-slate-900 block">{item.farmer}</span>
                  <span className="text-slate-500 text-[11px]">{item.commodity} • {item.qty}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-500 font-mono">{item.waitTime} wait</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                  item.status === 'Current'
                    ? 'bg-amber-100 text-amber-900'
                    : item.status === 'Completed'
                    ? 'bg-slate-100 text-slate-500'
                    : item.isUser
                    ? 'bg-emerald-100 text-emerald-900 font-black'
                    : 'bg-blue-100 text-blue-900'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
