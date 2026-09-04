import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, CheckCircle2, MessageSquare, Sparkles, Send, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SimulationNotice } from '../../components/common/SimulationNotice';

export const Feedback = () => {
  const navigate = useNavigate();
  const { submitFeedback, activeBooking } = useApp();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('Weighbridge Speed');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitFeedback({ rating, category, comment });
    setSubmitted(true);
  };

  const categories = [
    'Weighbridge Speed',
    'Queue Transparency',
    'Staff Courtesy',
    'Moisture Testing',
    'Simulated DBT Payout Speed',
  ];

  return (
    <div className="max-w-xl mx-auto space-y-6 text-left py-6 pb-12">
      <SimulationNotice
        compact
        message="Farmer Voice: Mandi Samiti uses citizen feedback to grade procurement centre operators."
      />

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
        {submitted ? (
          <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-black text-slate-900">Thank You for Your Feedback!</h2>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your response has been registered with Dadri Mandi Samiti. You earned{' '}
              <strong className="text-emerald-700 font-bold">+25 Kisan Reward points!</strong>
            </p>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
              >
                Submit Another Review
              </button>
              <button
                onClick={() => navigate('/farmer/rewards')}
                className="px-4 py-2 bg-purple-700 text-white text-xs font-bold rounded-lg hover:bg-purple-800"
              >
                Check Rewards (+25 Pts)
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center pb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Mandi Quality Audit
              </span>
              {/* Question: "How was your procurement experience?" (Exact prompt requirement) */}
              <h1 className="text-2xl font-black text-slate-900 mt-3">
                How was your procurement experience?
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Token {activeBooking.token} • {activeBooking.centreName}
              </p>
            </div>

            {/* 5-Star Rating Interface (Prompt requirement: Options: ★★★★★) */}
            <div className="text-center py-2">
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1.5 focus:outline-hidden transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-9 h-9 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs font-bold text-slate-700 mt-2">
                {rating === 5 && 'Outstanding • Zero Delay (5/5)'}
                {rating === 4 && 'Good • Smooth Procurement (4/5)'}
                {rating === 3 && 'Average • Slight Wait (3/5)'}
                {rating === 2 && 'Needs Improvement (2/5)'}
                {rating === 1 && 'Poor Experience (1/5)'}
              </p>
            </div>

            {/* Aspect Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Primary Aspect Reviewed:
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                      category === cat
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Box (Prompt requirement) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Comment Box
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share specific details about queue transparency, weighbridge operator behavior, or moisture deduction..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-xs text-slate-800"
              />
            </div>

            {/* Reward Points Callout */}
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Earn <strong>+25 Kisan Reward points</strong> upon submission.</span>
              </span>
            </div>

            {/* Submit Feedback Button (Prompt requirement) */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-700/25 flex items-center justify-center gap-2 transition"
            >
              <Send className="w-4 h-4" />
              <span>Submit Feedback</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
