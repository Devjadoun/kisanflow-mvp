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
  CalendarPlus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SimulationNotice } from '../../components/common/SimulationNotice';

export const LiveQueue = () => {
  const { activeBooking, farmerProfile, queueList, advanceQueue, realtimeStatus, lastSyncTime } = useApp();

  const currentFarmerId = farmerProfile?.farmerId || farmerProfile?.id;
  const cleanPhone = farmerProfile?.phone ? farmerProfile.phone.replace(/\D/g, '').slice(-10) : null;
  const farmerEmail = farmerProfile?.email ? farmerProfile.email.trim().toLowerCase() : null;

  const isFarmerActiveBooking = Boolean(
    activeBooking && farmerProfile && (
      (currentFarmerId && activeBooking.farmerId === currentFarmerId) ||
      (cleanPhone && (activeBooking.farmerPhone || '').replace(/\D/g, '').slice(-10) === cleanPhone) ||
      (farmerEmail && (activeBooking.farmerEmail || '').toLowerCase() === farmerEmail)
    )
  );
  const myBooking = isFarmerActiveBooking ? activeBooking : null;

  // Active serving token
  const currentToken = queueList.find(q => q.status === 'Called' || q.status === 'Current' || q.status === 'Processing') || queueList[0];
  const totalTokens = queueList.length;
  const completedCount = queueList.filter(q => q.status === 'Completed').length;
  const progressPercent = totalTokens > 0 ? Math.min(100, Math.round((completedCount / totalTokens) * 100)) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left pb-12">
      <SimulationNotice
        compact
        message="Live Digital Mandi Queue: Real-time Supabase synchronization without page refresh."
      />

      {/* Realtime Connection Status Bar */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-bold text-slate-700">
            <span className={`w-2 h-2 rounded-full ${realtimeStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{realtimeStatus === 'connected' ? 'Real-Time Telemetry Active' : 'Connecting to Server...'}</span>
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-mono text-[11px]">Last Sync: {lastSyncTime}</span>
        </div>
        <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">
          Wait: MVP ESTIMATE
        </span>
      </div>

      {/* Main Centre & Token Headline Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
              {myBooking?.centreName || 'Dadri Mandi Samiti Intake'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-mono font-semibold">
              Live Queue Status
            </span>
          </div>
        </div>

        {/* 4 Large Highlight Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {/* CURRENTLY SERVING */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
              CURRENTLY SERVING
            </span>
            <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono mt-1 block">
              {currentToken ? currentToken.token : 'None'}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {currentToken ? `Counter #01 (${currentToken.status})` : 'Weighbridge Idle'}
            </span>
          </div>

          {/* YOUR TOKEN */}
          <div className="bg-emerald-950/80 p-4 rounded-2xl border-2 border-emerald-500 shadow-md">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-300 block">
              YOUR TOKEN
            </span>
            <span className="text-3xl sm:text-4xl font-black text-white font-mono mt-1 block">
              {myBooking ? myBooking.token : 'None'}
            </span>
            <span className="text-[10px] text-emerald-400 mt-1 block font-semibold">
              {myBooking ? `${myBooking.commodityName?.split(' ')[0]} • ${myBooking.quantityKg} kg` : 'No booking'}
            </span>
          </div>

          {/* QUEUE POSITION */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
              QUEUE POSITION
            </span>
            <span className="text-3xl sm:text-4xl font-black text-white font-mono mt-1 block">
              {myBooking ? `#${myBooking.queuePosition}` : 'N/A'}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {myBooking ? `${Math.max(0, myBooking.queuePosition - 1)} Ahead` : 'Empty Queue'}
            </span>
          </div>

          {/* ESTIMATED WAIT */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
              ESTIMATED WAIT
            </span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono mt-1 block">
              {myBooking ? `${myBooking.predictedWaitMinutes} min` : '0 min'}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">MVP dynamic speed</span>
          </div>
        </div>

        {/* Progress Bar */}
        {totalTokens > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Mandi Intake Progress</span>
              <span className="font-mono font-bold text-white">{progressPercent}% Cleared ({completedCount}/{totalTokens})</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Live Visual Vehicle Stream (Section 41 & Section 11) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-slate-700" />
            <h2 className="font-bold text-sm text-slate-900">
              Live Queue Lineup ({queueList.length} Vehicles)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Server Authoritative</span>
        </div>

        {queueList.length === 0 ? (
          /* Empty Queue State */
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Active Vehicles in Queue</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
              There are currently no tractors or trucks lined up in this Mandi queue. Book an appointment slot to generate your live queue token.
            </p>
            <div className="mt-5">
              <Link
                to="/farmer/book-slot"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>Book Slot & Join Queue</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {queueList.map((item, idx) => {
              const isUser = Boolean(myBooking && myBooking.token === item.token);
              const isCalled = item.status === 'Called' || item.status === 'YOU (Called!)';
              const isCompleted = item.status === 'Completed';

              return (
                <div
                  key={item.id || `${item.token}-${idx}`}
                  className={`p-4 sm:px-6 flex items-center justify-between transition-colors ${
                    isUser
                      ? 'bg-emerald-50/80 border-l-4 border-emerald-600'
                      : isCalled
                      ? 'bg-amber-50/60 border-l-4 border-amber-500'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center w-14">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                        Token
                      </span>
                      <span className={`text-xl font-black font-mono ${isUser ? 'text-emerald-700' : 'text-slate-800'}`}>
                        {item.token}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{item.farmer}</span>
                        {isUser && (
                          <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold uppercase">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.commodity} • {item.qty} • {item.counter}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      isCompleted
                        ? 'bg-slate-100 text-slate-600'
                        : isCalled
                        ? 'bg-amber-100 text-amber-900 animate-pulse'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.status}
                    </span>
                    <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                      {item.waitTime}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
