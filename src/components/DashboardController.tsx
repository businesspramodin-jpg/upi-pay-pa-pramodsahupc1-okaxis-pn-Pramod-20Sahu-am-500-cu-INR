/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MerchantConfig } from '../types';
import { PRESET_AMOUNTS, PRESET_MERCHANTS } from '../constants';
import { Settings, RefreshCw, Copy, Check, Info, FileText, IndianRupee, User, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

interface DashboardControllerProps {
  config: MerchantConfig;
  onChange: (newConfig: MerchantConfig) => void;
  upiLink: string;
}

export default function DashboardController({ config, onChange, upiLink }: DashboardControllerProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  const updateField = (field: keyof MerchantConfig, value: any) => {
    onChange({
      ...config,
      [field]: value,
      // Regenerate timestamp if status changes
      ...(field === 'status' ? { timestamp: new Date().toLocaleString() } : {})
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(upiLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const randomizeTxnId = () => {
    const nextTxn = 'TXN' + Math.floor(100000 + Math.random() * 900000);
    updateField('transactionId', nextTxn);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 lg:p-8 space-y-6 flex flex-col justify-between h-full">
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">Payment Controller</h2>
              <p className="text-xs text-slate-400 font-medium">Configure parameters and simulate states</p>
            </div>
          </div>
          <button
            onClick={randomizeTxnId}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
            title="Regenerate Transaction ID"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            New ID
          </button>
        </div>

        {/* Quick Presets Section */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">Test Merchant Presets</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_MERCHANTS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onChange({
                    ...config,
                    merchantName: preset.name,
                    upiId: preset.upi,
                    note: preset.note,
                  });
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer hover:border-blue-500 hover:bg-blue-50/5 ${
                  config.upiId === preset.upi
                    ? 'border-blue-500 bg-blue-50/15 ring-2 ring-blue-500/10'
                    : 'border-slate-100 bg-white'
                }`}
              >
                <p className="text-[11px] font-bold text-slate-800 truncate">{preset.name}</p>
                <p className="text-[9px] text-slate-400 font-mono truncate">{preset.upi}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Merchant Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Merchant Payee Name
            </label>
            <input
              type="text"
              value={config.merchantName}
              onChange={(e) => updateField('merchantName', e.target.value)}
              placeholder="e.g. Pramod Sahu"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:outline-hidden transition-all shadow-2xs"
            />
          </div>

          {/* UPI ID */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> UPI ID (Virtual Payment Address)
            </label>
            <input
              type="text"
              value={config.upiId}
              onChange={(e) => updateField('upiId', e.target.value)}
              placeholder="e.g. user@okaxis"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:outline-hidden transition-all shadow-2xs font-mono"
            />
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5" /> Transaction Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
              <input
                type="number"
                min="1"
                max="100000"
                value={config.amount || ''}
                onChange={(e) => updateField('amount', Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full pl-7 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 font-bold bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:outline-hidden transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Note / Remarks */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> Payment Remarks / Note
            </label>
            <input
              type="text"
              value={config.note}
              onChange={(e) => updateField('note', e.target.value)}
              placeholder="e.g. Invoice #2034"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:outline-hidden transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Preset Amounts Fast Select */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">Quick Amounts</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => updateField('amount', amt)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  config.amount === amt
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-100'
                    : 'border-slate-150 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Status Simulator */}
        <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-150 space-y-3">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-slate-500" />
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Manual Transaction Status Override</h4>
          </div>
          <p className="text-[11px] text-slate-400">Instantly toggle status on the mobile frame to see approval states:</p>
          
          <div className="grid grid-cols-3 gap-2 pt-1">
            {(['Pending', 'Success', 'Failed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => updateField('status', st)}
                className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  config.status === st
                    ? st === 'Pending'
                      ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500/20'
                      : st === 'Success'
                      ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-500/20'
                      : 'bg-rose-100 text-rose-800 ring-2 ring-rose-500/20'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generated Intent String Explorer */}
      <div className="pt-6 border-t border-gray-100 space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">UPI Protocol Intent Link</label>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-600">Copy Link</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-slate-900 rounded-2xl p-4 text-white relative group overflow-hidden">
          <div className="absolute top-2 right-2 text-[9px] uppercase tracking-wider bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
            intent://
          </div>
          <p className="font-mono text-[11px] break-all text-slate-300 leading-normal select-all">
            {upiLink}
          </p>

          {/* Breakdown helper blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 mt-3 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
            <div>
              <span className="text-slate-500 block text-[9px] font-bold uppercase">PA (Address)</span>
              <span className="text-emerald-400 font-medium truncate block">{config.upiId}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] font-bold uppercase">PN (Name)</span>
              <span className="text-blue-400 font-medium truncate block">{config.merchantName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] font-bold uppercase">AM (Amount)</span>
              <span className="text-amber-400 font-medium truncate block">{config.amount}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] font-bold uppercase">CU (Currency)</span>
              <span className="text-purple-400 font-medium truncate block">INR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
