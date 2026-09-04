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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DigitalReceiptModal } from '../../components/common/DigitalReceiptModal';
import { SimulationNotice } from '../../components/common/SimulationNotice';

export const PaymentReceipt = () => {
  const { activeBooking, farmerProfile } = useApp();
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left py-6 pb-12">
      <SimulationNotice
        compact
        message="Simulated Payment Gateway: Demonstrates automated Direct Benefit Transfer (DBT) disbursal for Smart India Hackathon prototype."
      />

      {/* Main Payment Completed Card (Exact Prompt Specification) */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center relative overflow-hidden">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center mb-4 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          Simulated DBT Payment (Demo Data)
        </span>

        <h1 className="text-3xl font-black text-slate-900 mt-2">
          PROCUREMENT COMPLETED ✓
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Electronic weighbridge sign-off confirmed by Dadri Mandi Superintendent.
        </p>

        {/* Big Payout Amount Banner */}
        <div className="my-6 p-6 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono">
              Net Simulated DBT Payment
            </span>
            <div className="text-4xl sm:text-5xl font-black text-white mt-1 font-mono">
              ₹{activeBooking.totalEstimatedAmount ? activeBooking.totalEstimatedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '5,687.50'}
            </div>
            <p className="text-xs text-slate-400 mt-1">Simulated deposit to demo bank account</p>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6 w-full sm:w-auto">
            <span className="text-xs uppercase tracking-wider text-slate-400 block">Payment Status</span>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-800 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {activeBooking.paymentStatus || 'Successful'}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1 font-mono">
              Mode: Simulated DBT (Demo Data)
            </span>
          </div>
        </div>

        {/* Required Financial Breakdown List (Prompt Specs) */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left text-xs space-y-3">
          <div className="flex justify-between py-1.5 border-b border-slate-200/60">
            <span className="text-slate-500">Commodity:</span>
            <strong className="text-slate-900 font-bold">{activeBooking.commodityName || 'Wheat (गेहूं)'}</strong>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-200/60">
            <span className="text-slate-500">Quantity:</span>
            <strong className="text-slate-900 font-bold">
              {activeBooking.quantityKg || 250} kg ({((activeBooking.quantityKg || 250) / 100).toFixed(1)} Quintals)
            </strong>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-200/60">
            <span className="text-slate-500">Rate:</span>
            <strong className="text-slate-900 font-bold">
              ₹{activeBooking.ratePerQuintal ? activeBooking.ratePerQuintal.toLocaleString('en-IN') : '2,275'} / quintal (MSP 2026)
            </strong>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-200/60">
            <span className="text-slate-500">Total:</span>
            <strong className="text-emerald-700 font-black text-sm">
              ₹{activeBooking.totalEstimatedAmount ? activeBooking.totalEstimatedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '5,687.50'}
            </strong>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-200/60">
            <span className="text-slate-500">Payment Status:</span>
            <strong className="text-emerald-700 font-bold">{activeBooking.paymentStatus || 'Successful'}</strong>
          </div>

          <div className="flex justify-between py-1.5">
            <span className="text-slate-500">Transaction ID:</span>
            <strong className="font-mono font-bold text-slate-900">{activeBooking.transactionId || 'KF-PAY-001245'}</strong>
          </div>
        </div>

        {/* Bank Details Strip */}
        <div className="mt-4 p-3.5 bg-blue-50 rounded-xl border border-blue-200 text-left text-xs text-blue-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-700 shrink-0" />
            <div>
              <span className="font-bold block">Disbursed to: Demo Account (Bank of Baroda)</span>
              <span className="text-slate-500 text-[11px]">A/C No: •••••••••••4921 • Simulated Routing</span>
            </div>
          </div>
          <span className="text-[10px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded font-bold uppercase">
            Demo Account
          </span>
        </div>

        {/* Button: View Digital Receipt (Explicit prompt requirement) */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => setShowReceiptModal(true)}
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-700/25 flex items-center justify-center gap-2 transition"
          >
            <FileText className="w-5 h-5" />
            <span>View Digital Receipt</span>
          </button>

          <div className="flex items-center justify-between pt-2">
            <Link
              to="/farmer/rewards"
              className="text-xs text-purple-700 font-bold hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>You earned +100 reward points for this cycle!</span>
            </Link>

            <Link
              to="/farmer/feedback"
              className="text-xs text-slate-600 font-semibold hover:text-slate-900"
            >
              Rate Mandi Experience →
            </Link>
          </div>
        </div>
      </div>

      <DigitalReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        booking={activeBooking}
      />
    </div>
  );
};
