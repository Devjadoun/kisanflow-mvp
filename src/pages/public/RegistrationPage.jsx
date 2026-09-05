import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Wheat,
  User,
  Phone,
  MapPin,
  Globe,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { checkPhoneExists, registerFarmer } from '../../services/kisanFlowService';
import { isSMSProviderConfigured } from '../../services/notificationService';

export const RegistrationPage = () => {
  const navigate = useNavigate();
  const { setUserRole, loginFarmer } = useApp();

  // Step 1: Profile Details, Step 2: OTP Verification
  const [step, setStep] = useState(1);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('Gautam Buddha Nagar');
  const [state, setState] = useState('Uttar Pradesh');
  const [preferredLanguage, setPreferredLanguage] = useState('Hindi / English');

  // OTP state
  const [otp, setOtp] = useState('');
  const [generatedDemoOtp, setGeneratedDemoOtp] = useState('849201');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);

  // Status & error messages
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const isRealSMS = isSMSProviderConfigured();

  // Cooldown countdown timer
  useEffect(() => {
    let interval = null;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Step 1: Submit Registration Form
  const handleProceedToOTP = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Clean & validate phone
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!village.trim()) {
      setErrorMsg('Please enter your village / tehsil.');
      return;
    }

    setLoading(true);
    try {
      // Check duplicate registration
      const exists = await checkPhoneExists(cleanPhone);
      if (exists) {
        setErrorMsg('This mobile number is already registered. Please sign in instead.');
        setLoading(false);
        return;
      }

      // Generate dynamic OTP for verification
      const newOtp = String(Math.floor(100000 + Math.random() * 900000));
      setGeneratedDemoOtp(newOtp);
      setResendTimer(30);
      setCanResend(false);
      setOtpAttempts(0);
      setStep(2);
    } catch (err) {
      setErrorMsg('Unable to verify mobile availability. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and create account
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpAttempts >= 3) {
      setErrorMsg('Maximum OTP verification attempts exceeded. Please request a new OTP.');
      return;
    }

    // In demo mode: verify against generatedDemoOtp
    if (!isRealSMS && otp.trim() !== generatedDemoOtp) {
      setOtpAttempts(prev => prev + 1);
      setErrorMsg(`Incorrect OTP. ${2 - otpAttempts} attempts remaining.`);
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = phone.trim().replace(/\D/g, '');
      const profile = await registerFarmer({
        name: name.trim(),
        phone: `+91 ${cleanPhone}`,
        village: village.trim(),
        district: district.trim(),
        state: state.trim(),
        preferredLanguage,
      });

      setUserRole('farmer');
      await loginFarmer(profile);

      navigate('/farmer');
    } catch (err) {
      setErrorMsg('Failed to complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOTP = () => {
    if (!canResend) return;
    const newOtp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedDemoOtp(newOtp);
    setResendTimer(30);
    setCanResend(false);
    setOtpAttempts(0);
    setOtp('');
    setErrorMsg('');
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto w-full">
      {/* Mode Badge */}
      <div className="mb-4 flex items-center justify-between bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-xs">
        <span className="flex items-center gap-1.5 font-bold text-emerald-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>SIH 2026 Procurement Portal</span>
        </span>
        <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider ${isRealSMS ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
          {isRealSMS ? 'REAL SMS MODE' : 'DEMO OTP MODE'}
        </span>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-left">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl mx-auto flex items-center justify-center text-white shadow-md mb-3">
            <Wheat className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">New Farmer Registration</h1>
          <p className="text-xs text-slate-500 mt-1">
            Register your mobile for MSP queue token appointments and Mandi slot booking.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${step === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
            1. Farmer Details
          </span>
          <span className="text-slate-300">→</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${step === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
            2. OTP Verification
          </span>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Registration Form */}
        {step === 1 && (
          <form onSubmit={handleProceedToOTP} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Full Name (पूरा नाम) *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm font-medium"
                  placeholder="e.g. Ramesh Kumar"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Mobile Number (मोबाइल नंबर) *
              </label>
              <div className="relative">
                <span className="text-slate-500 font-bold text-xs absolute left-3 top-3">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm font-medium font-mono"
                  placeholder="9876543210"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">10-digit mobile for SMS queue alerts & token notifications</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Village / Tehsil (गांव) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm font-medium"
                    placeholder="e.g. Dhoom Manikpur"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  District (ज़िला)
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm font-medium bg-white"
                >
                  <option value="Gautam Buddha Nagar">Gautam Buddha Nagar</option>
                  <option value="Bulandshahr">Bulandshahr</option>
                  <option value="Ghaziabad">Ghaziabad</option>
                  <option value="Aligarh">Aligarh</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  State (राज्य)
                </label>
                <input
                  type="text"
                  value={state}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Preferred Language
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm font-medium bg-white"
                >
                  <option value="Hindi / English">Hindi / English (द्विभाषी)</option>
                  <option value="Hindi">हिंदी केवल (Hindi Only)</option>
                  <option value="English">English</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl font-bold text-sm text-white bg-emerald-700 hover:bg-emerald-800 shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Verifying Mobile...' : 'Continue to OTP Verification'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
              <p className="font-semibold">
                OTP sent to <strong>+91 {phone}</strong>
              </p>
              {!isRealSMS && (
                <div className="mt-2 p-2 bg-white rounded-lg border border-emerald-300 font-mono text-center">
                  <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-sans font-bold">
                    Demo Simulated OTP (Auto-Generated)
                  </span>
                  <span className="text-xl font-black text-emerald-700 tracking-widest">{generatedDemoOtp}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Enter 6-Digit OTP *
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-center text-xl font-black tracking-widest font-mono"
                placeholder="••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {resendTimer > 0 ? (
                  <span>Resend in {resendTimer}s</span>
                ) : (
                  <span className="text-emerald-700 font-semibold">Ready to resend</span>
                )}
              </div>

              <button
                type="button"
                onClick={handleResendOTP}
                disabled={!canResend}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 disabled:opacity-40 disabled:hover:text-emerald-700 flex items-center gap-1"
              >
                <RotateCw className="w-3 h-3" />
                <span>Resend OTP</span>
              </button>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setStep(1); setErrorMsg(''); }}
                className="w-1/3 py-3 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-2/3 py-3 rounded-xl font-bold text-sm text-white bg-emerald-700 hover:bg-emerald-800 shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Creating Account...' : 'Verify & Register'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Existing Farmer Link */}
        <div className="mt-6 pt-6 border-t border-slate-200 text-center text-xs text-slate-600">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-emerald-700 hover:text-emerald-900 underline">
            Sign In with Existing Account
          </Link>
        </div>
      </div>
    </div>
  );
};
