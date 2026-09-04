import React from 'react';
import { Link } from 'react-router-dom';
import { Wheat, Shield, Heart, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Wheat className="w-4 h-4" />
              </div>
              <span className="text-base font-black tracking-wider text-white">
                KISAN<span className="text-emerald-400">FLOW</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Predictive Smart Queue & Slot Management for Agricultural Procurement Centres.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-slate-800/80 p-2 rounded-md border border-slate-700">
              <Shield className="w-4 h-4 shrink-0" />
              <span>Smart India Hackathon 2026 Prototype</span>
            </div>
          </div>

          {/* Quick Portals */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">Core Portals</h4>
            <ul className="space-y-2">
              <li><Link to="/farmer" className="hover:text-emerald-400 transition">Farmer Dashboard</Link></li>
              <li><Link to="/farmer/book-slot" className="hover:text-emerald-400 transition">Book Mandi Slot</Link></li>
              <li><Link to="/farmer/live-queue" className="hover:text-emerald-400 transition">Live Queue Tracker</Link></li>
              <li><Link to="/operator" className="hover:text-emerald-400 transition">Mandi Operator Console</Link></li>
              <li><Link to="/admin" className="hover:text-emerald-400 transition">State Admin Directorate</Link></li>
            </ul>
          </div>

          {/* Technology & Algorithms */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">System Capabilities</h4>
            <ul className="space-y-2">
              <li><Link to="/admin/predictions" className="hover:text-emerald-400 transition">AI Slot Recommendation Engine</Link></li>
              <li><Link to="/farmer/procurement" className="hover:text-emerald-400 transition">Digital Weighbridge Verification</Link></li>
              <li><Link to="/farmer/payment" className="hover:text-emerald-400 transition">Simulated DBT Payment</Link></li>
              <li><Link to="/farmer/rewards" className="hover:text-emerald-400 transition">Kisan Incentives & Points</Link></li>
              <li><Link to="/admin/analytics" className="hover:text-emerald-400 transition">Mandi Throughput Analytics</Link></li>
            </ul>
          </div>

          {/* Government Aligned */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">Initiative Alignment</h4>
            <p className="text-slate-400 leading-relaxed mb-3">
              Designed in alignment with e-NAM (National Agriculture Market), PM-AASHA, and Smart India Hackathon guidelines to reduce mandi waiting times and queue congestion.
            </p>
            <div className="text-[11px] text-slate-500">
              Demo Simulation • Fictional Data Mode • No Real Transactions
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 KISANFLOW. Developed for Smart India Hackathon 2026 Internal Selection.</p>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-slate-300">Privacy Policy</Link>
            <Link to="/" className="hover:text-slate-300">Mandi Guidelines</Link>
            <Link to="/farmer/feedback" className="hover:text-slate-300">Submit Feedback</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
