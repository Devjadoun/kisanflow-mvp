import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  Clock,
  Building2,
  Wheat,
  Scale,
  Users,
  Eye,
  CalendarDays,
  Download,
  Share2,
  Sparkles,
  ArrowRight,
  Printer,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DigitalReceiptModal } from '../../components/common/DigitalReceiptModal';

export const BookingConfirmation = () => {
  const { activeBooking } = useApp();
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  if (!activeBooking) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900">No Active Booking Found</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            You don't have an active procurement token to display. Book a slot to generate your mandi token.
          </p>
          <Link
            to="/farmer/book-slot"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs"
          >
            <span>Book a Slot Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left py-6">
      {/* Confirmation Success Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl overflow-hidden relative text-center">
        {/* Confirmed Badge */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center mb-4 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          Token Allocated
        </span>

        <h1 className="text-3xl font-black text-slate-900 mt-2">
          Booking Confirmed ✓
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Your agricultural procurement appointment is registered in the state mandi queue.
        </p>

        {/* Big Token Display */}
        <div className="my-6 p-6 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono">Your Smart Token</span>
            <div className="text-5xl font-black tracking-tight text-white mt-1 font-mono">
              {activeBooking.token}
            </div>
            <p className="text-xs text-slate-400 mt-1">Keep this token ready at the mandi gate</p>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6 w-full sm:w-auto">
            <span className="text-xs uppercase tracking-wider text-slate-400 block">Queue Position</span>
            <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
              #{activeBooking.queuePosition}
            </div>
            <span className="text-xs text-slate-300 font-semibold block mt-1">
              Wait: ~{activeBooking.predictedWaitMinutes} min
            </span>
          </div>
        </div>

        {/* Required Details List (Exact prompt specs) */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left text-xs space-y-3">
          <div className="flex justify-between py-1.5 border-b border-slate-200/60">
            <span className="text-slate-500">Booking ID:</span>
            <strong className="font-mono font-bold text-slate-800">{activeBooking.bookingId}</strong>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-200/60">
            <span className="text-slate-500">Procurement Centre:</span>
            <strong className="text-slate-800">{activeBooking.centreName}</strong>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-200/60">
            <span className="text-slate-500">Commodity:</span>
            <strong className="text-slate-800">{activeBooking.commodityName}</strong>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-200/60">
            <span className="text-slate-500">Quantity:</span>
            <strong className="text-emerald-700 font-bold">{activeBooking.quantityKg} kg</strong>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-200/60">
            <span className="text-slate-500">Date:</span>
            <strong className="text-slate-800">{activeBooking.date}</strong>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-200/60">
            <span className="text-slate-500">Time:</span>
            <strong className="text-slate-800">{activeBooking.timeSlot}</strong>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-200/60">
            <span className="text-slate-500">Token:</span>
            <strong className="font-mono font-bold text-emerald-700">{activeBooking.token}</strong>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-200/60">
            <span className="text-slate-500">Queue Position:</span>
            <strong className="text-slate-800">{activeBooking.queuePosition}</strong>
          </div>

          <div className="flex justify-between py-1.5">
            <span className="text-slate-500">Predicted Waiting:</span>
            <strong className="text-amber-700 font-bold">{activeBooking.predictedWaitMinutes} minutes</strong>
          </div>
        </div>

        {/* Bonus points alert */}
        <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Kisan Loyalty Bonus: <strong>+50 points</strong> credited!</span>
          </span>
          <Link to="/farmer/rewards" className="text-emerald-700 font-bold hover:underline">
            View Rewards →
          </Link>
        </div>

        {/* 3 Explicit Buttons: View Live Queue, View Booking, Download Receipt */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/farmer/live-queue"
            className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20 transition"
          >
            <Eye className="w-4 h-4" />
            <span>View Live Queue</span>
          </Link>

          <Link
            to="/farmer/bookings"
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <CalendarDays className="w-4 h-4" />
            <span>View Booking</span>
          </Link>

          <button
            onClick={() => setShowReceiptModal(true)}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300 flex items-center justify-center gap-1.5 transition shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Download Receipt</span>
          </button>
        </div>
      </div>

      {/* Printable Receipt Modal Component */}
      <DigitalReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        booking={activeBooking}
      />
    </div>
  );
};
