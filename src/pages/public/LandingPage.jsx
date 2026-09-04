import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wheat,
  Sparkles,
  Clock,
  Eye,
  Bell,
  FileCheck,
  BarChart2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Building2,
  TrendingDown,
  Smartphone,
  ChevronRight,
} from 'lucide-react';
import { SimulationNotice } from '../../components/common/SimulationNotice';
import { useApp } from '../../context/AppContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { setUserRole } = useApp();

  const handleQuickRole = (role, path) => {
    setUserRole(role);
    navigate(path);
  };

  const featureCards = [
    {
      title: 'AI-Powered Slot Prediction',
      desc: 'Predictive queue analytics recommends optimal arrival slots with minimum waiting time based on historical mandi arrival patterns.',
      icon: Sparkles,
      color: 'emerald',
      badge: 'Smart ML Heuristics',
    },
    {
      title: 'Dynamic Slot Management',
      desc: 'Smart load balancing automatically adjusts available slots across weighbridges and counters to prevent mandi bottlenecks.',
      icon: Clock,
      color: 'blue',
      badge: 'Congestion Relief',
    },
    {
      title: 'Real-Time Queue Visibility',
      desc: 'Live digital token boards allow farmers to view their real-time queue position and counter status from their homes or en route.',
      icon: Eye,
      color: 'amber',
      badge: 'Zero Uncertainty',
    },
    {
      title: 'Alerts & Notifications',
      desc: 'Simulated SMS, WhatsApp, and audio prototype alerts designed to notify farmers when they are 3 positions away.',
      icon: Bell,
      color: 'purple',
      badge: 'Prototype Ping',
    },
    {
      title: 'Digital Procurement Tracking',
      desc: 'End-to-end transparent journey from gate arrival, quality inspection, automated weighbridge reading to simulated DBT payment.',
      icon: FileCheck,
      color: 'emerald',
      badge: '100% Traceable',
    },
    {
      title: 'Data-Driven Insights',
      desc: 'Comprehensive analytical dashboards for mandi officers and district officials to benchmark throughput and curb no-show rates.',
      icon: BarChart2,
      color: 'blue',
      badge: 'Govt Oversight',
    },
  ];

  const workflowSteps = [
    { step: '1', title: 'Farmer', desc: 'Opens portal or prototype interface', icon: Users },
    { step: '2', title: 'Select Centre', desc: 'Picks nearby Mandi Samiti', icon: Building2 },
    { step: '3', title: 'AI Slot Recommendation', desc: 'Gets lowest wait time slot', icon: Sparkles, highlight: true },
    { step: '4', title: 'Book Slot', desc: 'Receives instant Token #A027', icon: Clock },
    { step: '5', title: 'Live Queue', desc: 'Monitors turn from home/trolley', icon: Eye },
    { step: '6', title: 'Procurement', desc: 'Moisture check & weighing', icon: FileCheck },
    { step: '7', title: 'Payment', desc: 'Simulated DBT Payment', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Top Prototype Alert */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <SimulationNotice />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 lg:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Smart India Hackathon 2026 Innovation</span>
                <span className="text-emerald-300">|</span>
                <span className="text-emerald-700">Problem Statement ID: 26032</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                KISAN<span className="text-emerald-600">FLOW</span>
              </h1>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-700 leading-snug">
                Predictive Smart Queue & Slot Management for Procurement Centres
              </h2>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                "Helping farmers book smarter slots, avoid long queues and track their procurement journey in real time."
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/farmer/book-slot"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 text-white font-bold text-base hover:bg-emerald-800 shadow-md shadow-emerald-700/25 transition-all hover:scale-[1.02]"
                >
                  <span>Book a Slot</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-base hover:bg-slate-50 shadow-xs transition"
                >
                  <span>Login / Select Role</span>
                </Link>

                <Link
                  to="/farmer/live-queue"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-semibold text-sm transition"
                >
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span>Check Live Dadri Queue</span>
                </Link>
              </div>

              {/* Key Proof Points */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-left">
                <div>
                  <div className="flex items-center gap-1 text-emerald-700 font-black text-2xl sm:text-3xl">
                    <span>79%</span>
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Wait Time Cut</p>
                </div>
                <div>
                  <div className="text-slate-900 font-black text-2xl sm:text-3xl">
                    35 min
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Avg Mandi Turnaround</p>
                </div>
                <div>
                  <div className="text-emerald-700 font-black text-2xl sm:text-3xl">
                    100%
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Digital Transparency</p>
                </div>
              </div>
            </div>

            {/* Hero Right Visual: Live Simulation Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative">
                {/* Visual Header */}
                <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-bold text-sm">Dadri Mandi • Live Board</span>
                  </div>
                  <span className="text-[11px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono">
                    Token #A027
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-4 text-left">
                  {/* Status Banner */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
                        Your Appointment
                      </span>
                      <p className="text-base font-bold text-slate-900 mt-0.5">Today • 11:00 AM - 12:00 PM</p>
                      <p className="text-xs text-slate-600">Wheat (गेहूं) • 250 kg • Dadri Yard</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-700 font-mono">A027</span>
                      <span className="block text-[10px] text-emerald-600 font-medium">Position #8</span>
                    </div>
                  </div>

                  {/* AI Slot Callout */}
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-xl text-white shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-100">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Slot Recommendation</span>
                      </div>
                      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-semibold">96% Optimal</span>
                    </div>
                    <p className="text-sm font-bold mt-1">Predicted Waiting: 35 minutes</p>
                    <p className="text-xs text-emerald-100 mt-0.5">
                      "Lower expected congestion and shorter waiting time."
                    </p>
                  </div>

                  {/* Quick Queue Mini Strip */}
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>Currently Serving: <strong className="text-slate-900">A019</strong></span>
                      <span className="text-emerald-700 font-semibold">Est. Wait: 35 min</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500" style={{ width: '45%' }}></div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/farmer/live-queue"
                      className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition"
                    >
                      <span>Open Live Queue Tracker</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Six Major Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Core Technological Pillars
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-3">
            Engineered for Transparency & Queue Optimization
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Reducing waiting time, queue congestion and procurement uncertainty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-lg transition-all text-left flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform">
                  <span>Explore module</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Visual Workflow Flowchart (Requested by prompt) */}
      <section className="bg-slate-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            End-to-End Operational Lifecycle
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-3 text-white">
            How KisanFlow Optimizes the Procurement Journey
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto mt-2 mb-10">
            From field harvest booking to digital weighbridge verification and simulated Direct Benefit Transfer (DBT).
          </p>

          {/* Flow Steps Horizontal / Vertical Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {workflowSteps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl text-center border relative flex flex-col items-center justify-between transition-all ${
                    item.highlight
                      ? 'bg-emerald-950/80 border-emerald-500 shadow-md ring-1 ring-emerald-400'
                      : 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-700/80 text-emerald-400 font-bold text-xs flex items-center justify-center mb-2">
                    {item.step}
                  </div>
                  <div className={`p-2.5 rounded-lg mb-2 ${item.highlight ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-white">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/farmer/book-slot"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl transition shadow-md"
            >
              Test Slot Booking Wizard
            </Link>
            <Link
              to="/operator/queue"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl border border-slate-700 transition"
            >
              Test Operator Queue Controller
            </Link>
          </div>
        </div>
      </section>

      {/* Role Selection Interactive Grid for SIH Judges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
          Experience KisanFlow by User Persona
        </h2>
        <p className="text-slate-600 text-sm mb-8">
          Select any role to test the complete end-to-end interface designed for SIH 2026 evaluation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Farmer Persona */}
          <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500 shadow-md relative flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                Primary User
              </span>
              <h3 className="text-xl font-black text-slate-900">🌾 Farmer Portal</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Book dynamic slots, view AI recommendations, monitor real-time queue position #8, inspect moisture readings, and track simulated DBT receipts.
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Multi-step Mandi Slot Booking</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Live Queue Token Monitor (#A027)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Kisan Rewards (1,250 Pts) & Feedback</li>
              </ul>
            </div>
            <button
              onClick={() => handleQuickRole('farmer', '/farmer')}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm text-center transition"
            >
              Enter as Farmer (Ramesh Kumar)
            </button>
          </div>

          {/* Centre Operator Persona */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-md transition relative flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">
                Field Operations
              </span>
              <h3 className="text-xl font-black text-slate-900">🏢 Centre Operator</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Manage today’s 124 bookings at Dadri Mandi, call next farmer with audio chime, record moisture/weighbridge inputs, and mark arrivals.
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Call Next Farmer & Audio Chime</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Weighbridge Gross / Tare Calculator</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Live Mandi Status Dashboard (82% Util)</li>
              </ul>
            </div>
            <button
              onClick={() => handleQuickRole('operator', '/operator')}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm text-center transition"
            >
              Enter as Mandi Operator
            </button>
          </div>

          {/* Admin Persona */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-purple-500 shadow-sm hover:shadow-md transition relative flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full">
                State Directorate
              </span>
              <h3 className="text-xl font-black text-slate-900">🏛️ Admin / Official</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                High-level government analytics across 4 district mandis, 5 Recharts data models, AI forecast for tomorrow, and bottleneck diagnostics.
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> 5 Interactive Recharts Models</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Mandi Benchmark: Dadri 91% vs Bulandshahr 68%</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> AI Predictive Engine Pipeline</li>
              </ul>
            </div>
            <button
              onClick={() => handleQuickRole('admin', '/admin')}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm text-center transition"
            >
              Enter as State Admin
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
