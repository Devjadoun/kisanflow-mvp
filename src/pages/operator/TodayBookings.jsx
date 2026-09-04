import React, { useState } from 'react';
import {
  CalendarDays,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertTriangle,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SimulationNotice } from '../../components/common/SimulationNotice';

export const TodayBookings = () => {
  const { operatorBookings, updateOperatorBookingStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredBookings = operatorBookings.filter((b) => {
    const matchesSearch =
      b.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.commodity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-left pb-12">
      <SimulationNotice
        compact
        message="Daily Registry: 124 scheduled arrivals distributed across 6 dynamic time slots to balance weighbridge loads."
      />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Daily Master Registry
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Today's Bookings (124 Scheduled)</h1>
          <p className="text-xs text-slate-500">
            Search, filter, and inspect farmer delivery commitments for today at Dadri Mandi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            Slot Capacity: 20/hr
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by token, farmer name, crop..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 text-slate-800"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {['All', 'Booked', 'Arrived', 'Waiting', 'Processing', 'Completed', 'No-show'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                statusFilter === status
                  ? 'bg-blue-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200 uppercase text-[10px]">
            <tr>
              <th className="p-3">Token</th>
              <th className="p-3">Farmer Details</th>
              <th className="p-3">Commodity</th>
              <th className="p-3 text-right">Quantity</th>
              <th className="p-3">Time Window</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBookings.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono font-black text-sm text-slate-900">
                  <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                    {b.token}
                  </span>
                </td>
                <td className="p-3">
                  <div className="font-bold text-slate-900">{b.farmer}</div>
                  <span className="text-[11px] text-slate-400 font-mono">{b.phone} • {b.vehicle}</span>
                </td>
                <td className="p-3 font-medium text-slate-800">{b.commodity}</td>
                <td className="p-3 text-right font-mono font-bold text-slate-800">{b.quantityKg} kg</td>
                <td className="p-3 text-slate-600 font-mono text-[11px]">{b.slot}</td>
                <td className="p-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    {b.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <select
                    value={b.status}
                    onChange={(e) => updateOperatorBookingStatus(b.id, e.target.value)}
                    className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Booked">Booked</option>
                    <option value="Arrived">Arrived</option>
                    <option value="Waiting">Waiting</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="No-show">No-show</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
