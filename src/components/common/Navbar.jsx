import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Wheat,
  Bell,
  Volume2,
  VolumeX,
  Menu,
  X,
  User,
  ShieldCheck,
  Building2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    userRole,
    setUserRole,
    alertNotification,
    setAlertNotification,
    audioEnabled,
    setAudioEnabled,
    activeBooking,
    farmerProfile,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const isFarmerArea = location.pathname.startsWith('/farmer');
  const isOperatorArea = location.pathname.startsWith('/operator');
  const isAdminArea = location.pathname.startsWith('/admin');

  // Handle switching persona directly from navbar
  const handleRoleSwitch = (newRole, targetPath) => {
    setUserRole(newRole);
    navigate(targetPath);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Gov-Tech Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-200">Smart India Hackathon 2026 Prototype</span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-slate-400">Agricultural Produce Mandi Queue Optimization</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Audio Toggle */}
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              title={audioEnabled ? 'Chime sound enabled' : 'Chime muted'}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition px-1.5 py-0.5 rounded"
            >
              {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
              <span className="text-[11px] hidden sm:inline">{audioEnabled ? 'Audio On' : 'Muted'}</span>
            </button>

            {/* Quick Language Indicator */}
            <div className="flex items-center gap-1 text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
              <span className="text-emerald-400 font-semibold">EN</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400 hover:text-white cursor-pointer">हिन्दी</span>
            </div>

            {/* Role Switcher Pill for rapid SIH Judge evaluation */}
            <div className="flex items-center bg-slate-800/90 rounded-md p-0.5 border border-slate-700">
              <button
                onClick={() => handleRoleSwitch('farmer', '/farmer')}
                className={`px-2 py-0.5 text-[11px] rounded font-medium transition ${
                  isFarmerArea || userRole === 'farmer'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🌾 Farmer
              </button>
              <button
                onClick={() => handleRoleSwitch('operator', '/operator')}
                className={`px-2 py-0.5 text-[11px] rounded font-medium transition ${
                  isOperatorArea || userRole === 'operator'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🏢 Operator
              </button>
              <button
                onClick={() => handleRoleSwitch('admin', '/admin')}
                className={`px-2 py-0.5 text-[11px] rounded font-medium transition ${
                  isAdminArea || userRole === 'admin'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🏛️ Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                <Wheat className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-wider text-slate-900 leading-none font-sans">
                  KISAN<span className="text-emerald-600">FLOW</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5 hidden sm:block">
                  Smart Queue. Smart Slots. Stronger Procurement.
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                location.pathname === '/'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Overview
            </Link>
            <Link
              to="/farmer"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                isFarmerArea
                  ? 'text-emerald-700 bg-emerald-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Farmer Portal
            </Link>
            <Link
              to="/operator"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                isOperatorArea
                  ? 'text-blue-700 bg-blue-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Centre Operator
            </Link>
            <Link
              to="/admin"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                isAdminArea
                  ? 'text-purple-700 bg-purple-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Admin Dashboard
            </Link>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationPopup(!showNotificationPopup)}
                className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white animate-pulse" />
              </button>

              {/* Notification Dropdown */}
              {showNotificationPopup && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-900">Procurement Alerts</span>
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                      Token {activeBooking?.token || 'A027'}
                    </span>
                  </div>
                  <div className="p-3 space-y-2 text-xs">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-emerald-900">
                      <p className="font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        Dadri Mandi Queue Update
                      </p>
                      <p className="mt-1 text-slate-600">
                        Token {activeBooking.token} is at Queue Position {activeBooking.queuePosition}. Estimated waiting time: {activeBooking.predictedWaitMinutes} mins.
                      </p>
                    </div>

                    {alertNotification && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-amber-900">
                        <p className="font-medium flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
                          Queue Proximity Alert
                        </p>
                        <p className="mt-1 text-slate-600">{alertNotification}</p>
                      </div>
                    )}

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700">
                      <p className="font-medium">Simulated DBT Payment (Demo Data)</p>
                      <p className="mt-0.5 text-slate-500 text-[11px]">
                        Simulated payment of ₹5,687.50 will disburse to linked demo bank account upon weighbridge signoff.
                      </p>
                    </div>
                  </div>
                  <div className="px-4 pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                    <Link
                      to="/farmer/live-queue"
                      onClick={() => setShowNotificationPopup(false)}
                      className="text-emerald-700 font-medium hover:underline flex items-center gap-1"
                    >
                      Track Live Queue <ChevronRight className="w-3 h-3" />
                    </Link>
                    <button
                      onClick={() => {
                        setAlertNotification(null);
                        setShowNotificationPopup(false);
                      }}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Booking CTA */}
            <Link
              to="/farmer/book-slot"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm transition"
            >
              Book a Slot
            </Link>

            {/* Login / Profile CTA */}
            <Link
              to="/login"
              className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">Portal Login</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="p-2 bg-slate-50 rounded-lg text-xs font-medium text-slate-500">
            Switch Persona Portal:
            <div className="grid grid-cols-3 gap-1.5 mt-2">
              <button
                onClick={() => handleRoleSwitch('farmer', '/farmer')}
                className="py-1.5 px-2 rounded text-center text-xs font-semibold bg-emerald-600 text-white"
              >
                Farmer
              </button>
              <button
                onClick={() => handleRoleSwitch('operator', '/operator')}
                className="py-1.5 px-2 rounded text-center text-xs font-semibold bg-blue-600 text-white"
              >
                Operator
              </button>
              <button
                onClick={() => handleRoleSwitch('admin', '/admin')}
                className="py-1.5 px-2 rounded text-center text-xs font-semibold bg-purple-600 text-white"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Home / Overview
            </Link>
            <Link
              to="/farmer/book-slot"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium rounded-lg text-emerald-700 font-semibold bg-emerald-50"
            >
              Book a New Slot
            </Link>
            <Link
              to="/farmer/live-queue"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Live Queue Status
            </Link>
            <Link
              to="/farmer/procurement"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Procurement Journey
            </Link>
            <Link
              to="/farmer/rewards"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Kisan Rewards (1,250 Pts)
            </Link>
            <Link
              to="/admin/predictions"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
            >
              AI Prediction Engine
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
