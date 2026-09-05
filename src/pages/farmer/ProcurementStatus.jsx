import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck,
  CheckCircle2,
  Clock,
  Wheat,
  Scale,
  CreditCard,
  Building2,
  User,
  ShieldCheck,
  ArrowRight,
  Info,
  CalendarPlus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SimulationNotice } from '../../components/common/SimulationNotice';

export const ProcurementStatus = () => {
  const { activeBooking, farmerProfile } = useApp();

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

  if (!myBooking) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 text-left pb-12">
        <SimulationNotice
          compact
          message="Digital Procurement Lifecycle: Demonstrating weighbridge telemetry, quality testing, and DBT settlement."
        />
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <Scale className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">No Active Procurement in Progress</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
            There are no weighbridge or procurement operations currently linked to your profile. Book a slot to begin the procurement journey.
          </p>
          <div className="mt-6">
            <Link
              to="/farmer/book-slot"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Book Procurement Slot</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isCompleted = (myBooking.status || '').toLowerCase() === 'completed';
  const isProcessing = (myBooking.status || '').toLowerCase() === 'processing';

  // Status timeline steps
  const timelineSteps = [
    { title: 'Booking', status: 'completed', desc: `Online slot confirmed for ${myBooking.timeSlot || '11:00 AM'}` },
    { title: 'Arrival', status: isProcessing || isCompleted ? 'completed' : 'active', desc: 'Gate entry verified via token registration' },
    { title: 'Queue', status: isProcessing || isCompleted ? 'completed' : 'active', desc: `Token ${myBooking.token} assigned in Mandi queue` },
    { title: 'Verification', status: isProcessing || isCompleted ? 'completed' : 'pending', desc: 'Aadhaar & Land Record validation' },
    { title: 'Weighing', status: isCompleted ? 'completed' : isProcessing ? 'active' : 'pending', desc: 'Electronic weighbridge gross & tare check' },
    { title: 'Procurement', status: isCompleted ? 'completed' : 'pending', desc: 'Quality grading & Mandi Samiti signoff' },
    { title: 'Payment', status: isCompleted ? 'completed' : 'pending', desc: 'Simulated DBT direct bank transfer disbursement' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left pb-12">
      <SimulationNotice
        compact
        message="Digital Procurement Lifecycle: Demonstrating telemetry from Mandi Samiti weighbridge and quality testing lab."
      />

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
              <span className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
              <span>{isCompleted ? 'Procurement Completed' : 'Procurement In Progress'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Procurement Lifecycle Tracker
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {myBooking.centreName || 'Dadri Procurement Centre'} • Counter #01
            </p>
          </div>

          <div className="text-left sm:text-right bg-slate-900 text-white p-4 rounded-xl">
            <span className="text-[10px] uppercase tracking-widest text-emerald-400 block font-mono">Token</span>
            <span className="text-3xl font-black font-mono">{myBooking.token}</span>
          </div>
        </div>

        {/* 4 Details Grid (Farmer, Commodity, Quantity, Token) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Farmer:</span>
            <strong className="text-slate-900 text-sm block mt-0.5">{farmerProfile?.name || 'Registered Farmer'}</strong>
            <span className="text-[10px] text-slate-500">{farmerProfile?.village || 'Local Tehsil'}</span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Commodity:</span>
            <strong className="text-slate-900 text-sm block mt-0.5">{myBooking.commodityName}</strong>
            <span className="text-[10px] text-emerald-700 font-semibold">MSP: ₹{myBooking.ratePerQuintal} / q</span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Quantity:</span>
            <strong className="text-emerald-700 text-sm block mt-0.5">{myBooking.quantityKg} kg</strong>
            <span className="text-[10px] text-slate-500 font-mono">₹{myBooking.totalEstimatedAmount?.toLocaleString()}</span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Token:</span>
            <strong className="font-mono text-slate-900 text-sm block mt-0.5">{myBooking.token}</strong>
            <span className="text-[10px] text-slate-500">Slot: {myBooking.timeSlot}</span>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="pt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Procurement Milestones
          </h2>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
            {timelineSteps.map((step, idx) => {
              const isStepCompleted = step.status === 'completed';
              const isStepActive = step.status === 'active';

              return (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Icon Bullet */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                      isStepCompleted
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                        : isStepActive
                        ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isStepCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isStepActive ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-bold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Step Description */}
                  <div className={`flex-1 p-3.5 rounded-xl border transition-all ${
                    isStepActive
                      ? 'bg-amber-50/70 border-amber-200 shadow-2xs'
                      : isStepCompleted
                      ? 'bg-emerald-50/30 border-emerald-100'
                      : 'bg-slate-50/50 border-slate-100 opacity-60'
                  }`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-bold ${isStepActive ? 'text-amber-950 font-black' : isStepCompleted ? 'text-slate-900' : 'text-slate-500'}`}>
                        {step.title} {isStepCompleted && '✓'}
                      </h3>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        isStepActive
                          ? 'bg-amber-200 text-amber-900'
                          : isStepCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {step.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        {isCompleted && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <Link
              to="/farmer/payment"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition"
            >
              <span>Proceed to Payment Receipt</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
