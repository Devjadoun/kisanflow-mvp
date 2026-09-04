import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarPlus,
  Users,
  Clock,
  Award,
  Wheat,
  Eye,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Receipt,
  FileCheck,
  Building2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { SimulationNotice } from '../../components/common/SimulationNotice';

export const FarmerDashboard = () => {
  const { activeBooking, farmerProfile } = useApp();

  return (
    <div className="space-y-6 text-left">
      <SimulationNotice compact />

      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Aadhaar Verified Farmer
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-500 font-mono">KCC: {farmerProfile.kccNumber}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Welcome, {farmerProfile.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {farmerProfile.village}, {farmerProfile.district} • Land Holding: {farmerProfile.landHolding}
          </p>
        </div>

        {/* Large "Book New Slot" button (explicit requirement) */}
        <div>
          <Link
            to="/farmer/book-slot"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.02] w-full md:w-auto"
          >
            <CalendarPlus className="w-5 h-5" />
            <span>Book New Slot</span>
          </Link>
        </div>
      </div>

      {/* 4 Required Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Upcoming Booking"
          value={activeBooking.token}
          subtitle={`${activeBooking.commodityName.split(' ')[0]} • ${activeBooking.quantityKg} kg`}
          icon={Wheat}
          color="emerald"
        />
        <StatCard
          title="Queue Position"
          value={`#${activeBooking.queuePosition}`}
          subtitle={`At ${activeBooking.centreName.split(' ')[0]} Mandi`}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Predicted Wait"
          value={`${activeBooking.predictedWaitMinutes} min`}
          subtitle="Estimated queue clearing speed"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Reward Points"
          value={farmerProfile.points.toLocaleString()}
          subtitle="Eligible for fertilizer vouchers"
          icon={Award}
          color="purple"
        />
      </div>

      {/* Today's/Upcoming Appointment Featured Card (Exact Prompt Specification) */}
      <div className="bg-white rounded-2xl border-2 border-emerald-500 shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-4 sm:px-6 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="text-base sm:text-lg font-bold">Today's / Upcoming Appointment</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-700/80 px-2.5 py-1 rounded font-mono font-bold">
              ID: {activeBooking.bookingId}
            </span>
            <span className="text-xs bg-white text-emerald-900 px-2.5 py-1 rounded font-bold uppercase">
              Status: {activeBooking.status}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Procurement Centre</span>
              <p className="text-base font-bold text-slate-900 mt-1">{activeBooking.centreName}</p>
              <p className="text-xs text-slate-500 mt-0.5">Counter #02 Weighbridge</p>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Commodity & Quantity</span>
              <p className="text-base font-bold text-slate-900 mt-1">
                {activeBooking.commodityName}
              </p>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">
                Quantity: <strong className="text-emerald-700">{activeBooking.quantityKg} kg</strong> (₹{activeBooking.ratePerQuintal}/q)
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Appointment Slot</span>
              <p className="text-base font-bold text-slate-900 mt-1">{activeBooking.timeSlot}</p>
              <p className="text-xs text-slate-500 mt-0.5">{activeBooking.date}</p>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Token & Position</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-emerald-700 font-mono">{activeBooking.token}</span>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  Queue Pos: {activeBooking.queuePosition}
                </span>
              </div>
              <p className="text-xs text-amber-700 font-semibold mt-0.5">
                Predicted Wait: {activeBooking.predictedWaitMinutes} minutes
              </p>
            </div>
          </div>

          {/* Quick Flow Actions */}
          <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Vehicle registered: <strong>{activeBooking.vehicleType}</strong></span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/farmer/live-queue"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Track Live Queue</span>
              </Link>

              <Link
                to="/farmer/procurement"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Procurement Status</span>
              </Link>

              <Link
                to="/farmer/payment"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 transition"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>View Payment & Receipt</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Slot Recommendation Nudge */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>AI Predictive Mandi Engine</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Avoid the 09:00 AM Rush Hour</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Our smart queue prediction algorithms forecast 95 minutes wait at 09:00 AM vs only 35 minutes at 11:00 AM. Always choose AI-recommended slots to earn bonus points and save diesel!
          </p>
          <div className="mt-4">
            <Link
              to="/farmer/ai-recommendation"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900"
            >
              <span>Explore AI Slot Predictions & Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Kisan Rewards Quick Balance */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Kisan Loyalty Rewards
              </span>
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-2">1,250 Points Available</h3>
            <p className="text-xs text-slate-600 mt-1">
              Earned by booking off-peak slots and providing feedback. Claim subsidies on IFFCO fertilizers and soil testing.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/farmer/rewards"
              className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
            >
              <span>Redeem Vouchers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/farmer/feedback"
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              +25 Pts: Give Mandi Feedback
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
