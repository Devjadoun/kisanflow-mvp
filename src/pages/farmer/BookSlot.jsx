import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Wheat,
  Scale,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Info,
  MapPin,
  Truck,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  PROCUREMENT_CENTRES,
  COMMODITIES,
  MOCK_SLOTS_PREDICTION,
} from '../../data/mockData';
import { SimulationNotice } from '../../components/common/SimulationNotice';

export const BookSlot = () => {
  const navigate = useNavigate();
  const { createBooking } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    centreId: 'dadri',
    commodityId: 'wheat',
    quantityKg: 250,
    vehicleType: 'Tractor Trolley (UP 16 AB 4912)',
    date: 'Today, 05 Sept 2026',
    rawDate: '2026-09-05',
    selectedSlot: '11:00 AM - 12:00 PM',
    isRecommended: true,
    predictedWaitMin: 35,
    expectedQueue: 8,
  });

  const selectedCentre = PROCUREMENT_CENTRES.find(c => c.id === formData.centreId) || PROCUREMENT_CENTRES[0];
  const selectedCommodity = COMMODITIES.find(c => c.id === formData.commodityId) || COMMODITIES[0];
  const estimatedAmount = formData.quantityKg * selectedCommodity.mspPerKg;

  // Step 5 slot selection handler
  const handleSlotSelect = (slot) => {
    setFormData(prev => ({
      ...prev,
      selectedSlot: slot.time,
      isRecommended: slot.isRecommended,
      predictedWaitMin: slot.predictedWaitMin,
      expectedQueue: slot.queue,
    }));
  };

  // Final confirmation
  const handleFinalSubmit = () => {
    createBooking({
      centreId: formData.centreId,
      commodityId: formData.commodityId,
      quantityKg: formData.quantityKg,
      vehicleType: formData.vehicleType,
      date: formData.date,
      rawDate: formData.rawDate,
      timeSlot: formData.selectedSlot,
      isRecommended: formData.isRecommended,
      predictedWaitMin: formData.predictedWaitMin,
    });
    navigate('/farmer/confirmation');
  };

  const steps = [
    { num: 1, label: 'Procurement Centre' },
    { num: 2, label: 'Commodity' },
    { num: 3, label: 'Quantity & Vehicle' },
    { num: 4, label: 'Preferred Date' },
    { num: 5, label: 'Time Slot & AI Engine' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left pb-12">
      <SimulationNotice
        compact
        message="Deterministic Slot Recommendation Engine: Calculates expected wait times using queue size, service rate, and mandi capacity."
      />

      {/* Wizard Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-6">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full">
              KisanFlow E-Booking
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">Book Procurement Slot</h1>
            <p className="text-xs text-slate-500">
              Reserve your weighbridge slot in advance to avoid mandi queues.
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
            Step {currentStep} of 5: <strong className="text-slate-900">{steps[currentStep - 1].label}</strong>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-5 gap-2">
          {steps.map((step) => {
            const isDone = currentStep > step.num;
            const isCurrent = currentStep === step.num;
            return (
              <div key={step.num} className="space-y-1.5">
                <div
                  className={`h-2 rounded-full transition-all ${
                    isDone
                      ? 'bg-emerald-600'
                      : isCurrent
                      ? 'bg-emerald-500 ring-2 ring-emerald-200'
                      : 'bg-slate-200'
                  }`}
                />
                <p className={`text-[11px] truncate font-medium ${isCurrent ? 'text-emerald-800 font-bold' : isDone ? 'text-slate-700' : 'text-slate-400'}`}>
                  {step.num}. {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        {/* STEP 1: Select Procurement Centre */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-lg font-bold text-slate-900">Step 1: Select Procurement Centre</h2>
            <p className="text-xs text-slate-500">
              Choose an authorized government mandi or procurement yard near your village.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {PROCUREMENT_CENTRES.map((centre) => {
                const isSelected = formData.centreId === centre.id;
                return (
                  <div
                    key={centre.id}
                    onClick={() => setFormData({ ...formData, centreId: centre.id })}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className={`w-5 h-5 ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`} />
                        <h3 className="font-bold text-slate-900 text-sm">{centre.name}</h3>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                    </div>

                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {centre.district}, {centre.state} • <strong className="text-slate-700">{centre.distanceKm} km away</strong>
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-200/60 grid grid-cols-3 gap-2 text-[11px] text-slate-600">
                      <div>
                        <span className="text-slate-400 block">Counters</span>
                        <strong className="text-slate-800">{centre.activeCounters} Active</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Capacity</span>
                        <strong className="text-slate-800">{centre.capacityPerHour}/hr</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Current Queue</span>
                        <strong className="text-emerald-700">{centre.currentQueue} farmers</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Select Commodity */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-lg font-bold text-slate-900">Step 2: Select Commodity for Procurement</h2>
            <p className="text-xs text-slate-500">
              Government procurement rates follow official Minimum Support Price (MSP) 2026.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {COMMODITIES.map((c) => {
                const isSelected = formData.commodityId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setFormData({ ...formData, commodityId: c.id })}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-400 font-mono">MSP 2026</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                    <p className="text-xs text-slate-500">{c.variety}</p>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-baseline justify-between">
                      <span className="text-xs text-slate-500">Govt Rate:</span>
                      <span className="text-base font-black text-emerald-700">₹{c.mspPerQuintal} <span className="text-[11px] font-normal text-slate-500">/ quintal</span></span>
                    </div>
                    <p className="text-[10px] text-slate-400 text-right mt-0.5">Max Moisture: {c.maxMoisturePercent}%</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Enter Quantity */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <h2 className="text-lg font-bold text-slate-900">Step 3: Enter Harvest Quantity & Haulage</h2>
            <p className="text-xs text-slate-500">
              Specify the quantity of {selectedCommodity.name} you plan to unload at {selectedCentre.name}.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Quantity Input */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Estimated Quantity (in Kilograms)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="50"
                    max="10000"
                    step="10"
                    value={formData.quantityKg}
                    onChange={(e) => setFormData({ ...formData, quantityKg: Math.max(10, Number(e.target.value)) })}
                    className="w-full text-2xl font-bold px-4 py-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-slate-900"
                  />
                  <span className="absolute right-4 top-4 text-xs font-bold text-slate-400 uppercase">
                    KG
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-2">
                  {[100, 250, 500, 1000, 2000].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setFormData({ ...formData, quantityKg: q })}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                        formData.quantityKg === q
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {q} kg ({(q / 100).toFixed(1)} q)
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Transport / Vehicle Type
                  </label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium focus:ring-2 focus:ring-emerald-600"
                  >
                    <option>Tractor Trolley (UP 16 AB 4912)</option>
                    <option>Mini Commercial Truck / Pickup (Tata Ace)</option>
                    <option>Bullock Cart / Animal Haulage</option>
                    <option>Bags via Pickup / Auto Carriage</option>
                  </select>
                </div>
              </div>

              {/* Live MSP Calculation Summary Card */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Procurement Valuation Summary
                  </span>
                  <div className="mt-4 space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Selected Crop:</span>
                      <strong className="text-slate-900">{selectedCommodity.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Quintals:</span>
                      <strong className="text-slate-900">{(formData.quantityKg / 100).toFixed(2)} Quintals</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>MSP Rate per Quintal:</span>
                      <strong className="text-slate-900">₹{selectedCommodity.mspPerQuintal}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated 50kg Bags:</span>
                      <strong className="text-slate-900">{Math.ceil(formData.quantityKg / 50)} Bags</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200">
                  <span className="text-xs text-slate-500 block">Estimated Payout (Simulated DBT):</span>
                  <span className="text-2xl font-black text-emerald-700">
                    ₹{estimatedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    *Simulated estimate: Final disbursement will be calibrated based on tare weight & moisture testing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Preferred Date */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-lg font-bold text-slate-900">Step 4: Select Preferred Delivery Date</h2>
            <p className="text-xs text-slate-500">
              Procurement centres operate 6 days a week from 08:00 AM to 06:00 PM.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {[
                { dateStr: 'Today, 05 Sept 2026', raw: '2026-09-05', tag: 'Fastest Payout', weather: '☀️ Clear 31°C' },
                { dateStr: 'Tomorrow, 06 Sept 2026', raw: '2026-09-06', tag: 'Optimal Flow', weather: '⛅ Partly Cloudy 29°C' },
                { dateStr: 'Monday, 08 Sept 2026', raw: '2026-09-08', tag: 'Fresh Week Window', weather: '☀️ Sunny 32°C' },
              ].map((item, idx) => {
                const isSelected = formData.date === item.dateStr;
                return (
                  <div
                    key={idx}
                    onClick={() => setFormData({ ...formData, date: item.dateStr, rawDate: item.raw })}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {item.tag}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mt-2">{item.dateStr}</h3>
                    <p className="text-xs text-slate-500 mt-1">{item.weather}</p>
                    <p className="text-[11px] text-slate-400 mt-2">Mandi Hours: 08:00 AM - 06:00 PM</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Time Slot & AI Engine (The most important feature) */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 5: Available Time Slots</h2>
                <p className="text-xs text-slate-500">
                  Select your arrival window. Our deterministic prediction engine highlights the optimal slot.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full self-start sm:self-auto flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Slot Scoring Enabled</span>
              </span>
            </div>

            {/* AI Recommendation Feature Highlight Banner (Explicit prompt requirement) */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-5 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/20">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-white/20">
                    <Sparkles className="w-5 h-5 text-emerald-100" />
                  </span>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200 block">
                      AI Recommendation
                    </span>
                    <h3 className="text-xl font-black">11:00 AM - 12:00 PM</h3>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-white text-emerald-900 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    AI RECOMMENDED
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
                <div>
                  <span className="text-emerald-200 block">Predicted waiting time:</span>
                  <strong className="text-lg font-bold text-white">35 minutes</strong>
                </div>
                <div>
                  <span className="text-emerald-200 block">Expected queue:</span>
                  <strong className="text-lg font-bold text-white">8 farmers</strong>
                </div>
                <div>
                  <span className="text-emerald-200 block">Centre capacity:</span>
                  <strong className="text-lg font-bold text-white">20 / hr</strong>
                </div>
                <div>
                  <span className="text-emerald-200 block">Congestion index:</span>
                  <strong className="text-lg font-bold text-emerald-300">Optimal (Low)</strong>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/15 text-xs text-emerald-100 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  <strong>Recommendation reason:</strong> "Lower expected congestion and shorter waiting time. Weighbridge turnaround is optimized at this window."
                </p>
              </div>
            </div>

            {/* List of All Slots (9:00 AM, 11:00 AM, 1:00 PM, 3:00 PM etc.) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Compare All Time Slots for {formData.date}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MOCK_SLOTS_PREDICTION.map((slot, idx) => {
                  const isSelected = formData.selectedSlot === slot.time;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSlotSelect(slot)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? slot.isRecommended
                            ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-300'
                            : 'border-slate-800 bg-slate-50 shadow-sm'
                          : slot.isRecommended
                          ? 'border-emerald-300 bg-emerald-50/30 hover:border-emerald-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <span className="font-bold text-slate-900 text-sm">{slot.time}</span>
                        </div>
                        {slot.isRecommended && (
                          <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> AI RECOMMENDED
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Queue:</span>
                          <strong className="text-slate-800">{slot.queue} farmers</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Predicted wait:</span>
                          <strong className={slot.predictedWaitMin <= 40 ? 'text-emerald-700' : 'text-amber-700'}>
                            {slot.predictedWaitMin} min
                          </strong>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-3 pt-2 border-t border-slate-200 text-xs font-semibold text-emerald-700 flex items-center justify-between">
                          <span>✓ Slot Selected</span>
                          <span className="text-[10px] text-slate-500">{slot.isRecommended ? '+50 Reward Points' : '+20 Points'}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prototype Deterministic Notice */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                <strong>Prototype Engine:</strong> Queue predictions are calculated deterministically via <code className="font-mono bg-slate-200 px-1 rounded">Wait = (Queue × AvgServiceTime) / ActiveCounters</code> and historical arrival heuristics for the prototype.
              </span>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-6">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition"
            >
              <span>Continue to {steps[currentStep].label}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-700/25 transition-all hover:scale-[1.02]"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Confirm & Generate Token</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
