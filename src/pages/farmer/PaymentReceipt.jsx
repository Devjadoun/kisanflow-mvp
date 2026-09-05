import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Receipt,
  FileText,
  CreditCard,
  Building2,
  Wheat,
  Scale,
  ShieldCheck,
  Download,
  Share2,
  Sparkles,
  ArrowRight,
  CalendarPlus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DigitalReceiptModal } from '../../components/common/DigitalReceiptModal';
import { SimulationNotice } from '../../components/common/SimulationNotice';

export const PaymentReceipt = () => {
  const { activeBooking, farmerProfile } = useApp();
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  if (!activeBooking) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-left py-6 pb-12">
        <SimulationNotice
          compact
          message="Simulated Payment Gateway: Demonstrates automated Direct Benefit Transfer (DBT) disbursal for prototype."
        />
        <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-xs text-center">
          <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">No Payment Records Found</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
            Payment disbursements are generated only after an actual physical procurement is processed and completed at the Mandi weighbridge.
          </p>
          <div className="mt-6">
            <Link
              to="/farmer/book-slot"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Book Appointment Slot</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isCompleted = (activeBooking.status || '').toLowerCase() === 'completed';

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left py-6 pb-12">
      <SimulationNotice
        compact
        message="Simulated Payment Gateway: Demonstrates automated Direct Benefit Transfer (DBT) disbursal for Smart India Hackathon prototype."
      />

      {/* Main Payment Completed Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center relative overflow-hidden">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center mb-4 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
          SIMULATED PAYMENT — DEMO MODE
        </span>

        <h1 className="text-3xl font-black text-slate-900 mt-2">
          {isCompleted ? 'PROCUREMENT COMPLETED ✓' : 'PROCUREMENT PENDING'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isCompleted
            ? 'Electronic weighbridge sign-off confirmed by Mandi Superintendent.'
            : 'Simulated disbursement will trigger upon weighbridge completion.'}
        </p>

        {/* Big Payout Amount Banner */}
        <div className="my-6 p-6 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono">
              Net Simulated DBT Settlement
            </span>
            <div className="text-4xl sm:text-5xl font-black text-white mt-1 font-mono">
              ₹{activeBooking.totalEstimatedAmount ? activeBooking.totalEstimatedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
            </div>
            <p className="text-xs text-slate-400 mt-1">Simulated Direct Benefit Transfer (DBT)</p>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6 w-full sm:w-auto">
            <span className="text-xs uppercase tracking-wider text-slate-400 block">Status</span>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-800 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {isCompleted ? 'Disbursed (Simulated)' : 'Pending Weighment'}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1 font-mono">
              Token: {activeBooking.token}
            </span>
          </div>
        </div>

        {/* 6 Receipt Metadata Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-left p-5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Transaction Reference:</span>
            <strong className="font-mono text-slate-900 text-xs block mt-0.5">{activeBooking.transactionId || 'KF-PAY-DEMO'}</strong>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Commodity:</span>
            <strong className="text-slate-900 block mt-0.5">{activeBooking.commodityName || 'Wheat'}</strong>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Net Weight:</span>
            <strong className="text-slate-900 block mt-0.5">{activeBooking.quantityKg || 0} kg</strong>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Rate / Quintal:</span>
            <strong className="text-emerald-700 block mt-0.5">₹{activeBooking.ratePerQuintal || 2275}</strong>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Procurement Centre:</span>
            <strong className="text-slate-900 block mt-0.5 truncate">{activeBooking.centreName || 'Dadri Centre'}</strong>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Payment Mode:</span>
            <strong className="text-amber-800 block mt-0.5 font-bold">Simulated DBT</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setShowReceiptModal(true)}
            className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 flex items-center gap-2 transition"
          >
            <FileText className="w-4 h-4" />
            <span>View & Print Official Receipt</span>
          </button>

          <Link
            to="/farmer/rewards"
            className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Check Kisan Rewards</span>
          </Link>
        </div>
      </div>

      {/* Digital Receipt Modal (if triggered) */}
      {showReceiptModal && (
        <DigitalReceiptModal
          booking={activeBooking}
          farmer={farmerProfile}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
};
