import React, { useState } from 'react';
import {
  User,
  MapPin,
  CreditCard,
  Wheat,
  ShieldCheck,
  Bell,
  Smartphone,
  CheckCircle2,
  Save,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SimulationNotice } from '../../components/common/SimulationNotice';

export const FarmerProfile = () => {
  const { farmerProfile, setFarmerProfile } = useApp();
  const [saved, setSaved] = useState(false);
  const [profileData, setProfileData] = useState(farmerProfile);

  const handleSave = (e) => {
    e.preventDefault();
    setFarmerProfile(profileData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left pb-12">
      <SimulationNotice compact message="Farmer Profile & Credentials: Linked to PM-Kisan and State Mandi Board registries." />

      {saved && (
        <div className="p-3 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Profile preferences and notification channels updated successfully!</span>
        </div>
      )}

      {/* Header Profile Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-2xl font-black shrink-0">
          {profileData.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900">{profileData.name}</h1>
            <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-700" /> Verified Producer
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {profileData.village}, {profileData.district}, {profileData.state}
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-600 mt-2">
            <span>Aadhaar: {profileData.aadhaar}</span>
            <span>•</span>
            <span>KCC: {profileData.kccNumber}</span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal & Land Details */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Land Holding & Registration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
              <input
                type="text"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Village & Tehsil</label>
              <input
                type="text"
                value={profileData.village}
                onChange={(e) => setProfileData({ ...profileData, village: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Land Holding Area</label>
              <input
                type="text"
                value={profileData.landHolding}
                onChange={(e) => setProfileData({ ...profileData, landHolding: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Banking & DBT Settlement */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Simulated DBT Bank Account (Demo Data)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Linked Bank (Demo)</label>
              <input
                type="text"
                value={profileData.bankAccount}
                disabled
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">IFSC Code (Demo)</label>
              <input
                type="text"
                value={profileData.ifsc}
                disabled
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-mono"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            *Simulated banking interface: In production, will connect with PFMS / NPCI for direct MSP disbursal.
          </p>
        </div>

        {/* Notifications & Language */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Queue Alert Preferences (Prototype Notifications)
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={profileData.smsAlerts}
                onChange={(e) => setProfileData({ ...profileData, smsAlerts: e.target.checked })}
                className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
              />
              <div>
                <strong className="text-slate-800 block">SMS Queue Proximity Pings (Prototype Simulation)</strong>
                <span className="text-slate-500 text-[11px]">Simulates SMS notification when you are 3 positions away</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={profileData.whatsappAlerts}
                onChange={(e) => setProfileData({ ...profileData, whatsappAlerts: e.target.checked })}
                className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
              />
              <div>
                <strong className="text-slate-800 block">WhatsApp Digital Token & Receipt (Prototype Simulation)</strong>
                <span className="text-slate-500 text-[11px]">Simulates sending QR token pass and digital receipt to WhatsApp</span>
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile Preferences</span>
        </button>
      </form>
    </div>
  );
};
