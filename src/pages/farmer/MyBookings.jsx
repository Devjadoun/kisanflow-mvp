import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  Building2,
  Wheat,
  Eye,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PAST_BOOKINGS } from '../../data/mockData';
import { DigitalReceiptModal } from '../../components/common/DigitalReceiptModal';

export const MyBookings = () => {
  const { activeBooking } = useApp();
  const [selectedTab, setSelectedTab] = useState('all'); // 'all', 'upcoming', 'completed'
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const allBookings = [
    {
      bookingId: activeBooking.bookingId,
      token: activeBooking.token,
      centreName: activeBooking.centreName,
      commodity: activeBooking.commodityName,
      quantityKg: activeBooking.quantityKg,
      ratePerKg: activeBooking.ratePerKg,
      total: `₹${(activeBooking.quantityKg * activeBooking.ratePerKg).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      date: activeBooking.date,
      timeSlot: activeBooking.timeSlot,
      status: activeBooking.status,
      paymentStatus: activeBooking.paymentStatus,
      isUpcoming: true,
    },
    ...PAST_BOOKINGS.map(b => ({ ...b, isUpcoming: false, timeSlot: '10:00 AM - 11:00 AM' })),
  ];

  const filtered = allBookings.filter(b => {
    if (selectedTab === 'upcoming') return b.isUpcoming;
    if (selectedTab === 'completed') return !b.isUpcoming;
    return true;
  });

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full">
            Farmer Records
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">My Mandi Bookings</h1>
          <p className="text-xs text-slate-500">
            Track active tokens, weighbridge schedules, and past procurement vouchers.
          </p>
        </div>

        <Link
          to="/farmer/book-slot"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Slot</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setSelectedTab('all')}
          className={`px-3 py-1.5 rounded-lg transition ${
            selectedTab === 'all'
              ? 'bg-emerald-700 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Appointments ({allBookings.length})
        </button>
        <button
          onClick={() => setSelectedTab('upcoming')}
          className={`px-3 py-1.5 rounded-lg transition ${
            selectedTab === 'upcoming'
              ? 'bg-emerald-700 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Upcoming ({allBookings.filter(b => b.isUpcoming).length})
        </button>
        <button
          onClick={() => setSelectedTab('completed')}
          className={`px-3 py-1.5 rounded-lg transition ${
            selectedTab === 'completed'
              ? 'bg-emerald-700 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Completed History ({PAST_BOOKINGS.length})
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-2xl p-6 border transition-all ${
              item.isUpcoming
                ? 'border-emerald-500 shadow-md ring-1 ring-emerald-200'
                : 'border-slate-200 shadow-xs hover:border-slate-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-black text-lg ${
                  item.isUpcoming ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {item.token}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{item.centreName}</h3>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      item.isUpcoming ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Booking ID: {item.bookingId} • Slot: {item.timeSlot}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-400 block">Total Valuation</span>
                <span className="text-lg font-black text-emerald-700 font-mono">{item.total}</span>
                <span className="text-[10px] text-slate-500 block">{item.paymentStatus}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
              <div>
                <span className="text-slate-400 block">Commodity:</span>
                <strong className="text-slate-800">{item.commodity}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Quantity:</span>
                <strong className="text-slate-800">{item.quantityKg} kg</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Delivery Date:</span>
                <strong className="text-slate-800">{item.date}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Simulated DBT:</span>
                <strong className="text-emerald-700 font-semibold">{item.paymentStatus}</strong>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                {item.isUpcoming ? '🔔 Prototype Alert: Notification triggers at 3 positions away' : 'Archive verified with Mandi Samiti (Demo Data)'}
              </div>

              <div className="flex items-center gap-2">
                {item.isUpcoming ? (
                  <Link
                    to="/farmer/live-queue"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Queue</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => setSelectedReceipt(activeBooking)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Digital Receipt</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <DigitalReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        booking={selectedReceipt}
      />
    </div>
  );
};
