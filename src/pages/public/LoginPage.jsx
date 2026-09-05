import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Wheat,
  User,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Clock,
  UserPlus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { checkPhoneExists, getFarmerProfileByPhone, registerFarmer } from '../../services/kisanFlowService';
import { isSMSProviderConfigured } from '../../services/notificationService';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { setUserRole, loginFarmer } = useApp();
  const [selectedTab, setSelectedTab] = useState('farmer'); // 'farmer', 'operator', 'admin'
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isRealSMS = isSMSProviderConfigured();

  const handleQuickLogin = async (role) => {
    setUserRole(role);
    if (role === 'farmer') {
      const profile = await getFarmerProfileByPhone('9876543210');
      if (profile) {
        await loginFarmer(profile);
      }
      navigate('/farmer');
    } else if (role === 'operator') {
      navigate('/operator');
    } else if (role === 'admin') {
      navigate('/admin');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (selectedTab === 'farmer') {
      const cleanPhone = phone.trim().replace(/\D/g, '').slice(-10);
      if (cleanPhone.length !== 10) {
        setErrorMsg('Please enter a valid 10-digit mobile number.');
        return;
      }

      setLoading(true);
      try {
        let profile = await getFarmerProfileByPhone(cleanPhone);
        if (!profile) {
          // Existing phone number -> existing profile
          // New phone number -> new profile
          profile = await registerFarmer({
            name: `Farmer ${cleanPhone.slice(-4)}`,
            phone: `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`,
            village: 'Dadri Tehsil',
            district: 'Gautam Buddha Nagar',
          });
        }
        await loginFarmer(profile);
        navigate('/farmer');
      } catch (err) {
        console.error('Login error:', err);
        setErrorMsg('Authentication error. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      handleQuickLogin(selectedTab);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto w-full">
      {/* Top Registration Callout for New Farmers */}
      <div className="mb-4 bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-emerald-700" />
          <span className="font-semibold text-emerald-950">New to KisanFlow?</span>
        </div>
        <Link
          to="/register"
          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition"
        >
          Register as New Farmer →
        </Link>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-left">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl mx-auto flex items-center justify-center text-white shadow-md mb-3">
            <Wheat className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Sign in to KisanFlow</h1>
          <p className="text-xs text-slate-500 mt-1">
            Smart Queue & Slot Management System for Mandi Procurement
          </p>
        </div>

        {/* Role Select Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl mb-6 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => { setSelectedTab('farmer'); setErrorMsg(''); }}
            className={`py-2 rounded-lg transition ${selectedTab === 'farmer' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:text-slate-900'}`}
          >
            🌾 Farmer
          </button>
          <button
            type="button"
            onClick={() => { setSelectedTab('operator'); setErrorMsg(''); }}
            className={`py-2 rounded-lg transition ${selectedTab === 'operator' ? 'bg-blue-600 text-white shadow-xs' : 'hover:text-slate-900'}`}
          >
            🏢 Operator
          </button>
          <button
            type="button"
            onClick={() => { setSelectedTab('admin'); setErrorMsg(''); }}
            className={`py-2 rounded-lg transition ${selectedTab === 'admin' ? 'bg-purple-600 text-white shadow-xs' : 'hover:text-slate-900'}`}
          >
            🏛️ Admin
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              {selectedTab === 'farmer' ? 'Registered Mobile Number' : selectedTab === 'operator' ? 'Operator ID' : 'Govt Email / Staff ID'}
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm font-medium font-mono"
              placeholder={selectedTab === 'farmer' ? 'Enter 10-digit mobile' : 'Enter designated ID'}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              {selectedTab === 'farmer' ? 'One Time Password (OTP)' : 'Security PIN / Password'}
            </label>
            <input
              type="password"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm font-medium font-mono"
              placeholder="••••••"
              required
            />
            {selectedTab === 'farmer' && (
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                <span>Demo OTP: 123456</span>
                <span className="text-emerald-700 font-semibold">{isRealSMS ? 'Real SMS Active' : 'Demo OTP Mode'}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 ${
              selectedTab === 'farmer'
                ? 'bg-emerald-700 hover:bg-emerald-800'
                : selectedTab === 'operator'
                ? 'bg-blue-700 hover:bg-blue-800'
                : 'bg-purple-700 hover:bg-purple-800'
            }`}
          >
            <span>{loading ? 'Authenticating...' : `Sign in to ${selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Portal`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Rapid One-Click Login for Evaluators */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center mb-3">
            Instant Evaluator Access (1-Click)
          </p>
          <div className="space-y-2">
            <button
              onClick={() => handleQuickLogin('farmer')}
              className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-900 flex items-center justify-between"
            >
              <span>🌾 Farmer Portal</span>
              <span className="text-[10px] bg-emerald-200 px-1.5 py-0.5 rounded text-emerald-800 font-bold">Launch</span>
            </button>
            <button
              onClick={() => handleQuickLogin('operator')}
              className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold text-blue-900 flex items-center justify-between"
            >
              <span>🏢 Dadri Mandi Operator Desk</span>
              <span className="text-[10px] bg-blue-200 px-1.5 py-0.5 rounded text-blue-800 font-bold">Weighbridge</span>
            </button>
            <button
              onClick={() => handleQuickLogin('admin')}
              className="w-full py-2 px-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-xs font-semibold text-purple-900 flex items-center justify-between"
            >
              <span>🏛️ State Admin Directorate</span>
              <span className="text-[10px] bg-purple-200 px-1.5 py-0.5 rounded text-purple-800 font-bold">Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
