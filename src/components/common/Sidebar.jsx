import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarPlus,
  Sparkles,
  CalendarDays,
  Users,
  Activity,
  Receipt,
  Award,
  MessageSquare,
  UserCheck,
  Building2,
  CheckCircle2,
  TrendingUp,
  Cpu,
  BarChart3,
  Scale,
  ShieldCheck,
  Database,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar = ({ role = 'farmer' }) => {
  const { farmerProfile, activeBooking } = useApp();
  const location = useLocation();

  const farmerNav = [
    { to: '/farmer', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/farmer/book-slot', label: 'Book Slot', icon: CalendarPlus },
    { to: '/farmer/ai-recommendation', label: 'AI Slot Engine', icon: Sparkles, badge: 'Smart' },
    { to: '/farmer/bookings', label: 'My Bookings', icon: CalendarDays },
    {
      to: '/farmer/live-queue',
      label: 'Live Queue',
      icon: Users,
      badge: activeBooking?.queuePosition ? `Pos #${activeBooking.queuePosition}` : null,
    },
    { to: '/farmer/procurement', label: 'Procurement Status', icon: Activity },
    { to: '/farmer/payment', label: 'Payment & Receipt', icon: Receipt },
    {
      to: '/farmer/rewards',
      label: 'Kisan Rewards',
      icon: Award,
      badge: `${farmerProfile?.points || 0} pts`,
    },
    { to: '/farmer/feedback', label: 'Feedback', icon: MessageSquare },
    { to: '/farmer/profile', label: 'Farmer Profile', icon: UserCheck },
  ];

  const operatorNav = [
    { to: '/operator', label: 'Centre Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/operator/queue', label: 'Live Queue Control', icon: Users, badge: 'Active' },
    { to: '/operator/bookings', label: "Today's Bookings", icon: CalendarDays },
    { to: '/operator/procurement', label: 'Procurement & Weighing', icon: Scale },
  ];

  const adminNav = [
    { to: '/admin', label: 'Admin Overview', icon: LayoutDashboard, exact: true },
    { to: '/admin/centres', label: 'Centre Performance', icon: Building2 },
    { to: '/admin/analytics', label: 'Analytics & Trends', icon: BarChart3 },
    { to: '/admin/predictions', label: 'AI & Predictive Engine', icon: Cpu, badge: 'MVP' },
    { to: '/admin/storage', label: 'Data & Storage View', icon: Database, badge: 'Postgres' },
    { to: '/admin/health', label: 'System Health & Audit', icon: Activity },
  ];

  const currentNav = role === 'operator' ? operatorNav : role === 'admin' ? adminNav : farmerNav;
  const roleLabel = role === 'operator' ? 'Operator Console' : role === 'admin' ? 'State Mandi Admin' : 'Farmer Portal';
  const roleBadgeColor = role === 'operator' ? 'bg-blue-100 text-blue-800' : role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800';

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between shrink-0 hidden lg:flex">
      <div className="p-4">
        {/* Role Header Card */}
        <div className="mb-4 pb-4 border-b border-slate-100">
          <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${roleBadgeColor}`}>
            {roleLabel}
          </span>
          <p className="mt-2 text-sm font-bold text-slate-800 truncate">
            {role === 'operator'
              ? 'Dadri Procurement Incharge'
              : role === 'admin'
              ? 'Govt of UP - Agri Portal'
              : farmerProfile?.name || 'Registered Farmer'}
          </p>
          <p className="text-xs text-slate-500 truncate">
            {role === 'operator'
              ? 'Counter #01 - Weighbridge'
              : role === 'admin'
              ? 'State Agriculture Directorate'
              : farmerProfile?.village || 'Dadri Tehsil'}
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? role === 'operator'
                      ? 'bg-blue-50 text-blue-800 font-semibold shadow-2xs'
                      : role === 'admin'
                      ? 'bg-purple-50 text-purple-800 font-semibold shadow-2xs'
                      : 'bg-emerald-50 text-emerald-800 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${
                    isActive
                      ? role === 'operator'
                        ? 'text-blue-700'
                        : role === 'admin'
                        ? 'text-purple-700'
                        : 'text-emerald-700'
                      : 'text-slate-400'
                  }`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? 'bg-white text-slate-800 shadow-2xs'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Mandi Support Strip */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-950">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Kisan Toll-Free Helpline</span>
          </div>
          <p className="mt-1 text-slate-600 text-[11px]">
            Dial <strong className="text-slate-900">1800-180-1551</strong> for Mandi slot assistance or weather queries.
          </p>
        </div>
      </div>
    </aside>
  );
};
