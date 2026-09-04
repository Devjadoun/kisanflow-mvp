import React, { useState } from 'react';
import { Info, X, ShieldAlert } from 'lucide-react';

export const SimulationNotice = ({ title = 'SIH 2026 Prototype Engine Notice', message, compact = false }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const defaultMsg = message || 'This interface demonstrates KisanFlow’s deterministic slot prediction engine and simulated Direct Benefit Transfer (DBT) workflows using prototype data for Smart India Hackathon 2026.';

  if (compact) {
    return (
      <div className="bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-xs px-3 py-1.5 rounded-lg flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span><strong>Prototype Mode:</strong> {defaultMsg}</span>
        </span>
        <button onClick={() => setDismissed(true)} className="text-emerald-700 hover:text-emerald-950">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50/90 to-emerald-50/90 border border-blue-200/80 rounded-xl p-3.5 text-xs text-slate-700 flex items-start gap-3 shadow-xs">
      <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5">
        <Info className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <span className="font-semibold text-slate-900 block mb-0.5">{title}</span>
        <p className="text-slate-600 leading-relaxed">{defaultMsg}</p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition"
        title="Dismiss notice"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
