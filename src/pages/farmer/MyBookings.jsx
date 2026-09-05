import React, { useState, useEffect } from 'react';
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
  CalendarPlus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getFarmerBookings } from '../../services/kisanFlowService';
import { DigitalReceiptModal } from '../../components/common/DigitalReceiptModal';

export const MyBookings = () => {
  const { activeBooking, farmerProfile } = useApp();
  const [selectedTab, setSelectedTab] = useState('all'); // 'all', 'upcoming', 'completed'
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [dbBookings, setDbBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const fId = farmerProfile?.farmerId || farmerProfile?.id;
        if (fId || farmerProfile?.phone) {
          const bookings = await getFarmerBookings(fId, farmerProfile?.phone);
          setDbBookings(bookings || []);
        } else {
          setDbBookings([]);
        }
      } catch {
        setDbBookings([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [farmerProfile?.farmerId, farmerProfile?.id, farmerProfile?.phone, activeBooking]);

  // Combine active booking with database bookings, deduplicating by bookingId
  const allList = [];
  const currentFarmerId = farmerProfile?.farmerId || farmerProfile?.id;
  if (activeBooking && (!activeBooking.farmerId || !currentFarmerId || activeBooking.farmerId === currentFarmerId)) {
    allList.push({
      bookingId: activeBooking.bookingId,
      token: activeBooking.token,
      centreName: activeBooking.centreName,
      commodity: activeBooking.commodityName,
      quantityKg: activeBooking.quantityKg,
      ratePerKg: activeBooking.ratePerKg,
      total: `₹${(Number(activeBooking.quantityKg) * Number(activeBooking.ratePerKg || 22.75)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      date: activeBooking.date,
      timeSlot: activeBooking.timeSlot,
      status: activeBooking.status,
      paymentStatus: activeBooking.paymentStatus,
      isUpcoming: (activeBooking.status || '').toLowerCase() !== 'completed',
    });
  }

  dbBookings.forEach(b => {
    if (!allList.some(item => item.bookingId === b.bookingId || item.token === b.token)) {
      allList.push({
        bookingId: b.bookingId,
        token: b.token,
        centreName: b.centreName || 'Dadri Procurement Centre',
        commodity: b.commodityName || 'Wheat',
        quantityKg: b.quantityKg,
        ratePerKg: b.ratePerKg || 22.75,
        total: `₹${(Number(b.totalEstimatedAmount || (b.quantityKg * 22.75))).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
        date: b.date || 'Today',
        timeSlot: '11:00 AM - 12:00 PM',
        status: b.status || 'Booked',
        paymentStatus: b.status?.toLowerCase() === 'completed' ? 'Successful' : 'Pending',
        isUpcoming: b.status?.toLowerCase() !== 'completed',
      });
    }
  });

  const filtered = allList.filter(b => {
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
          All Appointments ({allList.length})
        </button>
        <button
          onClick={() => setSelectedTab('upcoming')}
          className={`px-3 py-1.5 rounded-lg transition ${
            selectedTab === 'upcoming'
              ? 'bg-emerald-700 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Upcoming ({allList.filter(b => b.isUpcoming).length})
        </button>
        <button
          onClick={() => setSelectedTab('completed')}
          className={`px-3 py-1.5 rounded-lg transition ${
            selectedTab === 'completed'
              ? 'bg-emerald-700 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Completed ({allList.filter(b => !b.isUpcoming).length})
        </button>
      </div>

      {/* Bookings List or Clean Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900">No Appointments Recorded</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            You do not have any bookings matching the selected category.
          </p>
          <div className="mt-5">
            <Link
              to="/farmer/book-slot"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Book Appointment Slot</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b, idx) => (
            <div
              key={b.id || b.bookingId || `${b.token}-${idx}`}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-500 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-xs">
                    Token: {b.token}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">ID: {b.bookingId}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    b.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {b.status}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-1">{b.commodity} • {b.quantityKg} kg</h3>
                <p className="text-xs text-slate-500 mt-0.5">{b.centreName} • {b.date} • {b.timeSlot}</p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Estimated</span>
                  <span className="font-mono font-bold text-sm text-slate-900">{b.total}</span>
                </div>
                <Link
                  to="/farmer/live-queue"
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>Track</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedReceipt && (
        <DigitalReceiptModal
          booking={selectedReceipt}
          farmer={farmerProfile}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
};
