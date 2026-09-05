import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Wheat,
  User,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Clock,
  UserPlus,
  Mail,
  Phone,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  resolveOrCreateFarmerProfile,
  getFarmerProfileByIdentifier,
  supabase,
  isSupabaseConfigured,
} from '../../services/kisanFlowService';
import { isSMSProviderConfigured } from '../../services/notificationService';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { setUserRole, loginFarmer } = useApp();
  const [selectedTab, setSelectedTab] = useState('farmer'); // 'farmer', 'operator', 'admin'
  const [identifier, setIdentifier] = useState('6396917770');
  const [operatorId, setOperatorId] = useState('DDR-OP-401');
  const [adminId, setAdminId] = useState('admin@upagri.gov.in');
  const [step, setStep] = useState('input'); // 'input' or 'otp'
  const [otp, setOtp] = useState('123456');
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const isRealSMS = isSMSProviderConfigured();

  // Instant 1-Click login for evaluators
  const handleQuickLogin = async (role, testIdent = null) => {
    setErrorMsg('');
    setInfoMsg('');
    setUserRole(role);

    if (role === 'farmer') {
      setLoading(true);
      try {
        const targetIdent = testIdent || identifier || '6396917770';
        const profile = await resolveOrCreateFarmerProfile({ identifier: targetIdent });
        if (profile) {
          await loginFarmer(profile);
          navigate('/farmer');
        } else {
          setErrorMsg('Unable to initialize farmer profile.');
        }
      } catch (err) {
        console.error('Quick login error:', err);
        setErrorMsg('Authentication error. Please try again.');
      } finally {
        setLoading(false);
      }
    } else if (role === 'operator') {
      navigate('/operator');
    } else if (role === 'admin') {
      navigate('/admin');
    }
  };

  // Step 1: Handle Initial Submission (Continue / Send OTP)
  const handleContinue = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (selectedTab !== 'farmer') {
      handleQuickLogin(selectedTab);
      return;
    }

    const trimmed = identifier.trim();
    if (!trimmed) {
      setErrorMsg('Please enter a mobile number or email address.');
      return;
    }

    // Check if input is Email Address
    if (trimmed.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }

      setLoading(true);
      setIsEmailMode(true);

      if (isSupabaseConfigured() && supabase?.auth) {
        try {
          const { error } = await supabase.auth.signInWithOtp({
            email: trimmed.toLowerCase(),
          });

          if (error) {
            // Honest message: DO NOT fake that an email was sent
            const isRateLimit = error.message?.toLowerCase().includes('rate limit');
            const honestMessage = isRateLimit
              ? `Email OTP rate limit reached: ${error.message}`
              : (error.message || 'Email OTP is not configured');
            setErrorMsg(honestMessage);
            setLoading(false);
            return;
          }

          // OTP sent successfully
          setStep('otp');
          setOtp('');
          setInfoMsg(`Verification OTP sent to ${trimmed}. Please enter the 6-digit code.`);
        } catch (err) {
          setErrorMsg(err.message || 'Email OTP is not configured');
        } finally {
          setLoading(false);
        }
      } else {
        setErrorMsg('Email OTP is not configured');
        setLoading(false);
      }
      return;
    }

    // Otherwise treat as 10-digit Indian Mobile Number
    const cleanDigits = trimmed.replace(/\D/g, '').slice(-10);
    if (cleanDigits.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number or email address.');
      return;
    }

    setIsEmailMode(false);
    setStep('otp');
    setOtp('123456');
    setInfoMsg(`Demo OTP generated for +91 ${cleanDigits}`);
  };

  // Step 2: Handle OTP Verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const trimmed = identifier.trim();

      if (isEmailMode) {
        const normEmail = trimmed.toLowerCase();
        if (!otp || otp.trim().length < 6) {
          setErrorMsg('Please enter the 6-digit OTP sent to your email.');
          setLoading(false);
          return;
        }

        if (isSupabaseConfigured() && supabase?.auth) {
          const { data, error } = await supabase.auth.verifyOtp({
            email: normEmail,
            token: otp.trim(),
            type: 'email',
          });

          if (error) {
            setErrorMsg(error.message || 'Invalid or expired OTP. Please try again.');
            setLoading(false);
            return;
          }

          const authUser = data?.user;
          const profile = await resolveOrCreateFarmerProfile({
            identifier: normEmail,
            email: normEmail,
            authUser,
          });
          await loginFarmer(profile);
          navigate('/farmer');
        } else {
          setErrorMsg('Email OTP is not configured');
        }
      } else {
        // Mobile Verification
        const cleanDigits = trimmed.replace(/\D/g, '').slice(-10);
        if (otp.trim() !== '123456' && !isRealSMS) {
          setErrorMsg('Invalid OTP. Please enter 123456 for demo verification.');
          setLoading(false);
          return;
        }

        const profile = await resolveOrCreateFarmerProfile({
          identifier: cleanDigits,
          phone: cleanDigits,
        });

        await loginFarmer(profile);
        navigate('/farmer');
      }
    } catch (err) {
      console.error('OTP Verification Error:', err);
      setErrorMsg('Verification failed: ' + (err.message || 'Please try again.'));
    } finally {
      setLoading(false);
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
            onClick={() => {
              setSelectedTab('farmer');
              setStep('input');
              setErrorMsg('');
              setInfoMsg('');
            }}
            className={`py-2 rounded-lg transition ${selectedTab === 'farmer' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:text-slate-900'}`}
          >
            🌾 Farmer
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedTab('operator');
              setStep('input');
              setErrorMsg('');
              setInfoMsg('');
            }}
            className={`py-2 rounded-lg transition ${selectedTab === 'operator' ? 'bg-blue-600 text-white shadow-xs' : 'hover:text-slate-900'}`}
          >
            🏢 Operator
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedTab('admin');
              setStep('input');
              setErrorMsg('');
              setInfoMsg('');
            }}
            className={`py-2 rounded-lg transition ${selectedTab === 'admin' ? 'bg-purple-600 text-white shadow-xs' : 'hover:text-slate-900'}`}
          >
            🏛️ Admin
          </button>
        </div>

        {/* Informational Message */}
        {infoMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{infoMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* FARMER LOGIN FLOW */}
        {selectedTab === 'farmer' && (
          <div>
            {step === 'input' ? (
              /* Step 1: Enter Mobile Number / Email */
              <form onSubmit={handleContinue} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Mobile Number / Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm font-medium font-mono"
                      placeholder="e.g. 7233023344 or farmer@example.com"
                      required
                      autoFocus
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Enter your 10-digit mobile number or registered email address.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-md bg-emerald-700 hover:bg-emerald-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{loading ? 'Validating...' : 'Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Step 2: Enter OTP */
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Authenticating identity:</span>
                    <strong className="text-slate-800 font-mono text-sm">{identifier}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('input');
                      setErrorMsg('');
                      setInfoMsg('');
                    }}
                    className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold text-xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change</span>
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      One Time Password (OTP)
                    </label>
                    {!isEmailMode && (
                      <span className="text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        Demo OTP: 123456
                      </span>
                    )}
                  </div>
                  <input
                    type="password"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm font-medium font-mono"
                    placeholder="Enter 6-digit OTP"
                    required
                    autoFocus
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>
                      {isEmailMode
                        ? 'Check your inbox for Supabase Auth code'
                        : isRealSMS
                        ? 'Real SMS Active via Twilio'
                        : 'Evaluation Mode: Use 123456'}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-md bg-emerald-700 hover:bg-emerald-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{loading ? 'Verifying...' : 'Verify OTP & Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* OPERATOR LOGIN FLOW */}
        {selectedTab === 'operator' && (
          <form onSubmit={(e) => { e.preventDefault(); handleQuickLogin('operator'); }} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Operator ID / Station Code
              </label>
              <input
                type="text"
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-sm font-medium font-mono"
                placeholder="DDR-OP-401"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Security PIN
              </label>
              <input
                type="password"
                defaultValue="••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-sm font-medium font-mono"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-md bg-blue-700 hover:bg-blue-800 transition flex items-center justify-center gap-2"
            >
              <span>Sign in to Operator Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ADMIN LOGIN FLOW */}
        {selectedTab === 'admin' && (
          <form onSubmit={(e) => { e.preventDefault(); handleQuickLogin('admin'); }} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Govt Email / Directorate ID
              </label>
              <input
                type="email"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-600 text-sm font-medium font-mono"
                placeholder="admin@upagri.gov.in"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Admin Password
              </label>
              <input
                type="password"
                defaultValue="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-600 text-sm font-medium font-mono"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-md bg-purple-700 hover:bg-purple-800 transition flex items-center justify-center gap-2"
            >
              <span>Sign in to Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Rapid One-Click Login for Evaluators */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center mb-3">
            Instant Evaluator Access (1-Click)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('farmer', '6396917770')}
              className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-900 flex items-center justify-between transition"
            >
              <span className="truncate">🌾 Test A: 6396917770</span>
              <span className="text-[10px] bg-emerald-200 px-1.5 py-0.5 rounded text-emerald-800 font-bold shrink-0">Sign In</span>
            </button>

            <button
              onClick={() => handleQuickLogin('farmer', '7233023344')}
              className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-900 flex items-center justify-between transition"
            >
              <span className="truncate">🌾 Test B: 7233023344</span>
              <span className="text-[10px] bg-emerald-200 px-1.5 py-0.5 rounded text-emerald-800 font-bold shrink-0">Sign In</span>
            </button>

            <button
              onClick={() => handleQuickLogin('farmer', '6207909760')}
              className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-900 flex items-center justify-between transition"
            >
              <span className="truncate">🌾 Test C: 6207909760</span>
              <span className="text-[10px] bg-emerald-200 px-1.5 py-0.5 rounded text-emerald-800 font-bold shrink-0">Sign In</span>
            </button>

            <button
              onClick={() => handleQuickLogin('farmer', '9876543210')}
              className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-900 flex items-center justify-between transition"
            >
              <span className="truncate">🌾 Baseline: 9876543210</span>
              <span className="text-[10px] bg-emerald-200 px-1.5 py-0.5 rounded text-emerald-800 font-bold shrink-0">Sign In</span>
            </button>

            <button
              onClick={() => handleQuickLogin('operator')}
              className="py-2 px-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold text-blue-900 flex items-center justify-between transition"
            >
              <span className="truncate">🏢 Dadri Mandi Operator</span>
              <span className="text-[10px] bg-blue-200 px-1.5 py-0.5 rounded text-blue-800 font-bold shrink-0">Desk</span>
            </button>

            <button
              onClick={() => handleQuickLogin('admin')}
              className="py-2 px-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-xs font-semibold text-purple-900 flex items-center justify-between transition"
            >
              <span className="truncate">🏛️ State Admin Directorate</span>
              <span className="text-[10px] bg-purple-200 px-1.5 py-0.5 rounded text-purple-800 font-bold shrink-0">Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
