import React, { useState } from 'react';
import {
  CalendarDays,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SimulationNotice } from '../../components/common/SimulationNotice';
import { exportToCSV, exportToXLSX } from '../../utils/exportReports';

export const TodayBookings = () => {
  const { operatorBookings, updateOperatorBookingStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredBookings = operatorBookings.filter((b) => {
    const matchesSearch =
      (b.farmer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.token || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.commodity || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = (format) => {
    const data = operatorBookings.map(b => ({
      'Token': b.token,
      'Booking ID': b.bookingId || b.id,
      'Farmer Name': b.farmer,
      'Phone': b.phone,
      'Commodity': b.commodity,
      'Quantity (kg)': b.quantityKg,
      'Slot Window': b.slot,
      'Status': b.status,
    }));

    if (format === 'csv') exportToCSV(data, 'TODAYS_SCHEDULED_BOOKINGS');
    else exportToXLSX(data, 'TODAYS_SCHEDULED_BOOKINGS');
  };

  return (
    <div className="space-y-6 text-left pb-12">
      <SimulationNotice
        compact
        message="Daily Registry: Authoritative scheduled arrivals distributed across dynamic Mandi time slots."
      />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Daily Master Registry
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Today's Bookings ({operatorBookings.length} Scheduled)
          </h1>
          <p className="text-xs text-slate-500">
            Search, filter, and inspect farmer delivery commitments for today at Dadri Mandi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('xlsx')}
            disabled={operatorBookings.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition shadow-xs disabled:opacity-50"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Registry (XLSX)</span>
          </button>
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
          {['All', 'Booked', 'Arrived', 'Waiting', 'Processing', 'Completed'].map((status) => (
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
        {filteredBookings.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No bookings found matching your search or filter criteria.
          </div>
        ) : (
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
              {filteredBookings.map((b, idx) => (
                <tr key={b.id || b.bookingId || `${b.token}-${idx}`} className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono font-bold text-blue-900">{b.token}</td>
                  <td className="p-3">
                    <span className="font-bold text-slate-900 block">{b.farmer}</span>
                    <span className="text-[11px] text-slate-400">{b.phone}</span>
                  </td>
                  <td className="p-3">{b.commodity}</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-700">
                    {b.quantityKg} kg
                  </td>
                  <td className="p-3 text-slate-500">{b.slot}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      b.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'Processing'
                        ? 'bg-purple-100 text-purple-800'
                        : b.status === 'Called'
                        ? 'bg-amber-100 text-amber-900'
                        : b.status === 'Arrived'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1">
                    {b.status === 'Booked' && (
                      <button
                        onClick={() => updateOperatorBookingStatus(b.token, 'Arrived')}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-900 text-white font-bold text-[10px] transition"
                      >
                        Arrived
                      </button>
                    )}
                    {(b.status === 'Arrived' || b.status === 'Booked' || b.status === 'Waiting') && (
                      <button
                        onClick={() => updateOperatorBookingStatus(b.token, 'Called')}
                        className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] transition"
                      >
                        Call
                      </button>
                    )}
                    {b.status === 'Called' && (
                      <button
                        onClick={() => updateOperatorBookingStatus(b.token, 'Processing')}
                        className="px-2 py-1 rounded bg-purple-700 hover:bg-purple-800 text-white font-bold text-[10px] transition"
                      >
                        Weigh
                      </button>
                    )}
                    {b.status === 'Processing' && (
                      <button
                        onClick={() => updateOperatorBookingStatus(b.token, 'Completed')}
                        className="px-2 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] transition"
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
