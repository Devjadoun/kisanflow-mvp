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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SimulationNotice } from '../../components/common/SimulationNotice';

export const ProcurementStatus = () => {
  const { activeBooking, farmerProfile } = useApp();

  // Status timeline required: Booking ✓, Arrival ✓, Queue ✓, Verification, Weighing, Procurement, Payment
  const timelineSteps = [
    { title: 'Booking', status: 'completed', desc: 'Online slot reserved for 11:00 AM' },
    { title: 'Arrival', status: 'completed', desc: 'Gate entry verified via ANPR scan' },
    { title: 'Queue', status: 'completed', desc: 'Position #8 in Dadri Mandi yard' },
    { title: 'Verification', status: 'active', desc: 'Aadhaar & Land Record validation in progress' },
    { title: 'Weighing', status: 'pending', desc: 'Electronic weighbridge gross & tare check' },
    { title: 'Procurement', status: 'pending', desc: 'Quality grading & Mandi Samiti signoff' },
    { title: 'Payment', status: 'pending', desc: 'Simulated DBT transfer to demo bank account' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left pb-12">
      <SimulationNotice
        compact
        message="Digital Procurement Lifecycle (Simulation): Demonstrating telemetry from Mandi Samiti weighbridge and quality testing lab with demo data."
      />

      {/* Main Header Card (Prompt Requirements) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Procurement In Progress</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Procurement Lifecycle Tracker
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Dadri Procurement Centre • Counter #02
            </p>
          </div>

          <div className="text-left sm:text-right bg-slate-900 text-white p-4 rounded-xl">
            <span className="text-[10px] uppercase tracking-widest text-emerald-400 block font-mono">Token</span>
            <span className="text-3xl font-black font-mono">{activeBooking.token || 'A027'}</span>
          </div>
        </div>

        {/* 4 Details Grid (Farmer, Commodity, Quantity, Token) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Farmer:</span>
            <strong className="text-slate-900 text-sm block mt-0.5">{farmerProfile.name}</strong>
            <span className="text-[10px] text-slate-500">{farmerProfile.village}</span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Commodity:</span>
            <strong className="text-slate-900 text-sm block mt-0.5">{activeBooking.commodityName}</strong>
            <span className="text-[10px] text-emerald-700 font-semibold">MSP: ₹2,275 / q</span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Quantity:</span>
            <strong className="text-emerald-700 text-sm block mt-0.5">{activeBooking.quantityKg} kg</strong>
            <span className="text-[10px] text-slate-500">2.5 Quintals</span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Token:</span>
            <strong className="font-mono text-slate-900 text-sm block mt-0.5">{activeBooking.token}</strong>
            <span className="text-[10px] text-slate-500">Slot: 11:00 AM - 12:00 PM</span>
          </div>
        </div>

        {/* Status Timeline (Exact prompt spec: Booking ✓, Arrival ✓, Queue ✓, Verification, Weighing, Procurement, Payment) */}
        <div className="pt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Procurement Milestones
          </h2>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
            {timelineSteps.map((step, idx) => {
              const isCompleted = step.status === 'completed';
              const isActive = step.status === 'active';

              return (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Icon Bullet */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                        : isActive
                        ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isActive ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-bold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Step Description */}
                  <div className={`flex-1 p-3.5 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-amber-50/70 border-amber-200 shadow-2xs'
                      : isCompleted
                      ? 'bg-emerald-50/30 border-emerald-100'
                      : 'bg-slate-50/50 border-slate-100 opacity-60'
                  }`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-bold ${isActive ? 'text-amber-950 font-black' : isCompleted ? 'text-slate-900' : 'text-slate-500'}`}>
                        {step.title} {isCompleted && '✓'}
                      </h3>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-amber-200 text-amber-900'
                          : isCompleted
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

        {/* Quality Reading Card */}
        <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-bold text-slate-800">Quality Inspection Preview (Digital Moisture Tester):</span>
            <p className="text-slate-600">Sample tested: <strong>11.4% moisture</strong> (Standard permissible: &lt; 12.0%) • Grade A Certified</p>
          </div>
          <div className="shrink-0">
            <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
              Grade A Passed
            </span>
          </div>
        </div>

        {/* Advance Link to Payment */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end">
          <Link
            to="/farmer/payment"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition"
          >
            <span>Proceed to Simulated Payment & Receipt</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
