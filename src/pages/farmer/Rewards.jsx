import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Sparkles,
  CheckCircle2,
  Gift,
  ArrowRight,
  TrendingUp,
  Tag,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SimulationNotice } from '../../components/common/SimulationNotice';

export const Rewards = () => {
  const { farmerProfile, rewardsCatalog, rewardsHistory, claimReward } = useApp();
  const [claimToast, setClaimToast] = useState(null);

  const handleRedeem = (reward) => {
    const result = claimReward(reward.id);
    if (result.success) {
      setClaimToast(`Success: ${result.msg}`);
      setTimeout(() => setClaimToast(null), 4000);
    } else {
      setClaimToast(`Notice: ${result.msg}`);
      setTimeout(() => setClaimToast(null), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left pb-12">
      <SimulationNotice
        compact
        message="Kisan Loyalty Incentives: Rewards farmers for booking off-peak slots to naturally distribute mandi congestion."
      />

      {/* Toast */}
      {claimToast && (
        <div className="p-4 bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-between animate-in slide-in-from-top-2">
          <span>{claimToast}</span>
          <button onClick={() => setClaimToast(null)} className="text-emerald-200 hover:text-white">✕</button>
        </div>
      )}

      {/* Header (Exact Prompt Specification: KISAN REWARDS, Current Points: 1,250) */}
      <div className="bg-gradient-to-br from-purple-800 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/15">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Agri-Incentive Programme</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              KISAN REWARDS
            </h1>
            <p className="text-xs sm:text-sm text-purple-200 mt-1">
              Earn reward points for queue discipline, digital slots, and mandi reviews.
            </p>
          </div>

          {/* Current Points Block */}
          <div className="bg-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xs border border-white/15 text-left sm:text-right">
            <span className="text-xs uppercase tracking-widest text-purple-200 block font-medium">
              Current Points:
            </span>
            <div className="text-4xl sm:text-5xl font-black text-amber-300 font-mono mt-0.5">
              {farmerProfile.points.toLocaleString()}
            </div>
            <span className="text-[11px] text-purple-200 mt-1 block font-semibold">
              Tier: Gold Mandi Beneficiary
            </span>
          </div>
        </div>

        {/* Ways to Earn Points Required by Prompt */}
        <div className="pt-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-purple-300 mb-4">
            Sample Ways to Earn Points:
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* 1. Complete digital procurement +100 */}
            <div className="bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-xs flex items-center justify-between">
              <div>
                <span className="font-bold block text-white">Complete digital procurement</span>
                <span className="text-[10px] text-purple-200">End-to-end weighbridge cycle</span>
              </div>
              <span className="text-xl font-black text-amber-300 font-mono ml-2 shrink-0">
                +100
              </span>
            </div>

            {/* 2. Give feedback +25 */}
            <div className="bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-xs flex items-center justify-between">
              <div>
                <span className="font-bold block text-white">Give feedback</span>
                <span className="text-[10px] text-purple-200">Rate mandi service & speed</span>
              </div>
              <span className="text-xl font-black text-amber-300 font-mono ml-2 shrink-0">
                +25
              </span>
            </div>

            {/* 3. Use recommended slot +50 */}
            <div className="bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-xs flex items-center justify-between">
              <div>
                <span className="font-bold block text-white">Use recommended slot</span>
                <span className="text-[10px] text-purple-200">Select AI optimal arrival time</span>
              </div>
              <span className="text-xl font-black text-amber-300 font-mono ml-2 shrink-0">
                +50
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Show Reward Cards (Prompt requirement) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Redeemable Mandi Reward Vouchers</h2>
            <p className="text-xs text-slate-500">Subsidies on fertilizers, soil tests, and seed packages</p>
          </div>
          <span className="text-xs text-slate-500 font-medium">Updated for Rabi 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewardsCatalog.map((reward) => {
            const canAfford = farmerProfile.points >= reward.costPoints;
            return (
              <div
                key={reward.id}
                className={`bg-white rounded-2xl p-6 border-2 transition-all flex flex-col justify-between ${
                  reward.claimed
                    ? 'border-slate-200 opacity-80'
                    : canAfford
                    ? 'border-purple-300 hover:border-purple-600 shadow-xs'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                      {reward.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-purple-800">
                      {reward.costPoints} Points
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{reward.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{reward.validity}</p>

                  {reward.claimed && (
                    <div className="mt-3 p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-xs font-mono font-bold text-emerald-800 flex items-center justify-between">
                      <span>VOUCHER CODE:</span>
                      <span>{reward.code}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {reward.claimed ? 'Claimed' : canAfford ? 'Eligible for instant unlock' : `Need ${reward.costPoints - farmerProfile.points} more points`}
                  </span>

                  <button
                    disabled={reward.claimed || !canAfford}
                    onClick={() => handleRedeem(reward)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                      reward.claimed
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : canAfford
                        ? 'bg-purple-700 hover:bg-purple-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {reward.claimed ? 'Claimed ✓' : 'Redeem Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rewards Transaction Activity History */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Points Activity Ledger</h3>
        <div className="divide-y divide-slate-100 text-xs">
          {rewardsHistory.map((item) => (
            <div key={item.id} className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">{item.action}</p>
                <span className="text-[10px] text-slate-400">{item.date}</span>
              </div>
              <span className={`font-mono font-bold ${item.points.startsWith('+') ? 'text-emerald-600' : 'text-purple-600'}`}>
                {item.points} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
