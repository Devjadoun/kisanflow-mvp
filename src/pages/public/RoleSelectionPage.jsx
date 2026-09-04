import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wheat, Building2, BarChart3, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const { setUserRole } = useApp();

  const handleSelectRole = (role, path) => {
    setUserRole(role);
    navigate(path);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          Portal Gateway
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">
          Select Your KisanFlow Portal
        </h1>
        <p className="text-slate-600 text-sm mt-2">
          Choose a user role to explore the dedicated features, live queue operations, or government oversight tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {/* Farmer Card */}
        <div className="bg-white rounded-2xl border-2 border-emerald-500 shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Wheat className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Role 1</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Farmer Portal</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              For agricultural producers delivering wheat, paddy, mustard, and coarse grains to government procurement centres.
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Multi-step AI Slot Booking</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Real-time Queue Tracking (Token A027)</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Quality inspection & weighment logs</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Simulated Direct Benefit Transfer (DBT) receipt</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Kisan Reward points (1,250 pts)</li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectRole('farmer', '/farmer')}
            className="mt-6 w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-xs"
          >
            <span>Launch Farmer Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Operator Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-xl p-6 flex flex-col justify-between transition">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Role 2</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Centre Operator</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              For mandi supervisors, weighbridge technicians, and gate operators running live intake and quality verification.
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Live Queue Token Caller with Chime</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Today’s 124 Bookings Management</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Weighbridge Gross & Tare entry</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Status: Arrived, Processing, Completed</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Mandi gate capacity utilization (82%)</li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectRole('operator', '/operator')}
            className="mt-6 w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-xs"
          >
            <span>Launch Operator Desk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Admin Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-purple-500 hover:shadow-xl p-6 flex flex-col justify-between transition">
          <div>
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">Role 3</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Admin / Official</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              For state agricultural marketing boards, food corporation officers, and district collectors tracking macro performance.
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600" /> 5 Interactive Recharts analytics panels</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600" /> Multi-centre benchmark (Dadri vs Bulandshahr)</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600" /> AI Demand Forecast for Tomorrow</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600" /> Bottleneck and no-show rate analytics</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600" /> Total procurement volume & simulated DBT metrics</li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectRole('admin', '/admin')}
            className="mt-6 w-full py-3 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-xs"
          >
            <span>Launch State Admin</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
