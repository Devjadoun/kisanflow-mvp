import React, { useState } from 'react';
import {
  Scale,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Building2,
  Droplet,
  Truck,
  Printer,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SimulationNotice } from '../../components/common/SimulationNotice';

export const ProcurementManagement = () => {
  const { activeBooking, updateOperatorBookingStatus, playAlertSound } = useApp();

  const [grossWeight, setGrossWeight] = useState(3450);
  const [tareWeight, setTareWeight] = useState(3200);
  const [moisture, setMoisture] = useState(11.4);
  const [foreignMatter, setForeignMatter] = useState(0.8);
  const [settled, setSettled] = useState(false);

  const netWeight = Math.max(0, grossWeight - tareWeight);
  const mspRatePerKg = 22.75;
  const totalPayout = netWeight * mspRatePerKg;

  const handleApproveWeighment = (e) => {
    e.preventDefault();
    playAlertSound();
    setSettled(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left pb-12">
      <SimulationNotice
        compact
        message="Electronic Weighbridge Workstation: Automatically computes net weight from gross truck weight and empty tare weight."
      />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Weighbridge Station #02
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Procurement & Weighment Management
          </h1>
          <p className="text-xs text-slate-500">
            Calibrated electronic scale reading and automated moisture grading terminal.
          </p>
        </div>

        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-center">
          <span className="text-[10px] text-emerald-400 font-mono block">ACTIVE INTAKE TOKEN</span>
          <span className="text-2xl font-black font-mono">{activeBooking?.token || 'None'}</span>
        </div>
      </div>

      {settled && (
        <div className="p-4 bg-emerald-100 text-emerald-900 rounded-2xl border border-emerald-300 font-semibold text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <span>
              Weighment certificate generated! Simulated DBT payment of ₹{totalPayout.toFixed(2)} logged (Demo Mode).
            </span>
          </div>
          <button
            onClick={() => setSettled(false)}
            className="text-xs text-emerald-800 underline"
          >
            Reset Form
          </button>
        </div>
      )}

      {/* Workstation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-700" />
            <span>Digital Weighment Entry</span>
          </h2>

          <form onSubmit={handleApproveWeighment} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Gross Weight (Vehicle + Grain)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={grossWeight}
                    onChange={(e) => setGrossWeight(Number(e.target.value))}
                    className="w-full text-base font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 font-bold">KG</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Tare Weight (Empty Trolley)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={tareWeight}
                    onChange={(e) => setTareWeight(Number(e.target.value))}
                    className="w-full text-base font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 font-bold">KG</span>
                </div>
              </div>
            </div>

            {/* Quality testing values */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Moisture Content (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={moisture}
                  onChange={(e) => setMoisture(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
                <span className="text-[10px] text-emerald-700 font-medium mt-1 block">
                  ✓ Permissible limit: &lt; 12.0%
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Foreign Matter / Refraction (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={foreignMatter}
                  onChange={(e) => setForeignMatter(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Permissible: &lt; 1.0%
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 mt-4"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Sign-off Weighment & Simulate DBT Payout</span>
            </button>
          </form>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">
              Net Intake Calculation
            </span>
            <div className="mt-4 p-4 bg-slate-800/90 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 block">Verified Net Crop Weight</span>
              <span className="text-4xl font-black font-mono text-emerald-400 mt-1 block">
                {netWeight} KG
              </span>
              <span className="text-xs text-slate-300 mt-0.5 block font-mono">
                {(netWeight / 100).toFixed(2)} Quintals of Wheat
              </span>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Govt MSP Rate:</span>
                <span className="font-mono font-bold text-white">₹2,275.00 / q</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Moisture Deduction:</span>
                <span className="font-mono text-emerald-400">0.0% (Passed Grade A)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Total Net Valuation:</span>
                <span className="font-mono font-black text-emerald-400 text-base">
                  ₹{totalPayout.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
            <span>Operator: DDR-OP-401 • Calibration ID: WBR-2026-NIST</span>
          </div>
        </div>
      </div>
    </div>
  );
};
