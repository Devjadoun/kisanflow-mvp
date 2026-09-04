import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, Download, Share2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DigitalReceiptModal = ({ isOpen, onClose, booking }) => {
  const { farmerProfile } = useApp();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const b = booking;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <h3 className="font-bold text-slate-800 text-base">E-Procurement Mandi Digital Receipt</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700">
          {/* Official Letterhead */}
          <div className="text-center border-b border-dashed border-slate-300 pb-5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              GOVERNMENT OF UTTAR PRADESH • MANDI SAMITI
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">KISANFLOW PROCUREMENT VOUCHER</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Department of Agriculture Produce & e-Procurement Portal (SIH 2026)
            </p>
            <div className="mt-3 flex items-center justify-center gap-4 text-xs font-mono text-slate-600">
              <span>Receipt No: <strong>{b?.bookingId || 'KF-2026-00127'}</strong></span>
              <span>•</span>
              <span>Token: <strong className="text-emerald-700 font-bold">{b?.token || 'A027'}</strong></span>
              <span>•</span>
              <span>Date: {b?.date || '05 Sept 2026'}</span>
            </div>
          </div>

          {/* Farmer & Mandi Info Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Farmer Details</span>
              <p className="font-bold text-slate-800 text-sm mt-0.5">{farmerProfile.name}</p>
              <p className="text-slate-600">Aadhaar: {farmerProfile.aadhaar}</p>
              <p className="text-slate-600">Mobile: {farmerProfile.phone}</p>
              <p className="text-slate-600">Village: {farmerProfile.village}</p>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Procurement Centre</span>
              <p className="font-bold text-slate-800 text-sm mt-0.5">{b?.centreName || 'Dadri Procurement Centre'}</p>
              <p className="text-slate-600">Gate: Weighbridge Counter #02</p>
              <p className="text-slate-600">Slot: {b?.timeSlot || '11:00 AM - 12:00 PM'}</p>
              <p className="text-slate-600">Operator ID: DDR-OP-401</p>
            </div>
          </div>

          {/* Commodity & Weighment Breakdown */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Commodity & Variety</th>
                  <th className="p-3 text-right">Quantity (Kg)</th>
                  <th className="p-3 text-right">Govt MSP Rate</th>
                  <th className="p-3 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 font-medium text-slate-800">
                    {b?.commodityName || 'Wheat (गेहूं)'}
                    <div className="text-[11px] text-slate-500 font-normal">
                      Moisture: 11.4% (Permissible &lt; 12.0%) • Grade A
                    </div>
                  </td>
                  <td className="p-3 text-right font-mono font-semibold">{b?.quantityKg || 250} kg</td>
                  <td className="p-3 text-right font-mono">₹{b?.ratePerQuintal || 2275} / q</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">
                    ₹{b?.totalEstimatedAmount ? b.totalEstimatedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '5,687.50'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment & Bank Disbursal */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Payment Settlement Mode: Simulated Direct Benefit Transfer (DBT)</span>
              </div>
              <p className="text-[11px] text-slate-600">
                A/C: Demo Bank Account (•••• 4921) • Simulated Settlement
              </p>
              <p className="text-[11px] text-slate-600">
                Transaction Ref: <span className="font-mono font-bold text-slate-800">{b?.transactionId || 'KF-PAY-001245'}</span> (Demo Data)
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Simulated ✓
              </span>
            </div>
          </div>

          {/* QR Code & Digital Signature */}
          <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-lg p-1 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] font-mono leading-tight">MANDI QR</span>
                <span className="text-[7px] text-emerald-400">VERIFIED</span>
              </div>
              <div>
                <p className="font-semibold text-slate-700">Digitally Authenticated</p>
                <p>KisanFlow Cryptographic Smart Token</p>
                <p className="text-[10px] text-slate-400">Timestamp: 05-09-2026 11:45:12 IST</p>
              </div>
            </div>
            <div className="text-right">
              <div className="h-7 border-b border-slate-400 w-32 ml-auto mb-1"></div>
              <p className="font-medium text-slate-700">Mandi Superintendent</p>
              <p className="text-[10px] text-slate-400">Dadri Procurement Complex</p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition shadow-xs"
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
};
