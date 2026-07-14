/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ShieldCheck, Copy, Check, Smartphone, Calendar, Hash, ArrowUpRight, Lock, CheckCircle2, AlertTriangle, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';
import { MerchantConfig } from '../types';
import UPIQRCode from './UPIQRCode';
import HeaderStatusBar from './HeaderStatusBar';

interface PhoneMockupProps {
  config: MerchantConfig;
  upiLink: string;
  onOpenChooser: () => void;
  onCopyUPI: () => void;
  copied: boolean;
  onResetStatus: () => void;
  selectedAppUsed: string | null;
}

export default function PhoneMockup({
  config,
  upiLink,
  onOpenChooser,
  onCopyUPI,
  copied,
  onResetStatus,
  selectedAppUsed
}: PhoneMockupProps) {
  
  // Status styling map
  const getStatusConfig = () => {
    switch (config.status) {
      case 'Success':
        return {
          bg: 'bg-emerald-50 border-emerald-100',
          text: 'text-emerald-700',
          iconColor: 'text-emerald-500',
          bannerBg: 'bg-emerald-600',
          desc: 'Verified by NPCI Secure Ledger'
        };
      case 'Failed':
        return {
          bg: 'bg-rose-50 border-rose-100',
          text: 'text-rose-700',
          iconColor: 'text-rose-500',
          bannerBg: 'bg-rose-600',
          desc: 'Bank declined or cancelled'
        };
      default:
        return {
          bg: 'bg-blue-50/70 border-blue-100',
          text: 'text-blue-700',
          iconColor: 'text-blue-500',
          bannerBg: 'bg-gradient-to-r from-blue-600 to-indigo-600',
          desc: 'Awaiting app deep-link launch'
        };
    }
  };

  const statusStyle = getStatusConfig();

  return (
    <div className="w-full max-w-[375px] aspect-[9/19] bg-white rounded-[40px] shadow-2xl border-12 border-slate-900 overflow-hidden flex flex-col relative select-none">
      
      {/* 1. Hardware Notch & StatusBar */}
      <HeaderStatusBar />

      {/* 2. Scrollable Body container */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50 pb-6 flex flex-col scrollbar-thin">
        
        {/* Dynamic Status Banner */}
        <div className={`p-4 text-white text-center transition-all duration-500 ${statusStyle.bannerBg} relative overflow-hidden`}>
          {/* Animated decorative sparks for Success status */}
          {config.status === 'Success' && (
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <Sparkles className="absolute top-2 left-4 w-6 h-6 animate-pulse text-yellow-300" />
              <Sparkles className="absolute bottom-2 right-6 w-5 h-5 animate-pulse text-yellow-200" />
            </div>
          )}

          <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold opacity-85">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Secure UPI Gateway
            </span>
            <span className="font-mono">{config.currency}</span>
          </div>

          <div className="mt-2.5 flex flex-col items-center">
            {config.status === 'Pending' ? (
              <p className="text-[11px] font-semibold text-blue-100 uppercase tracking-wider">Awaiting Payment</p>
            ) : config.status === 'Success' ? (
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-200 fill-emerald-800" />
                <p className="text-[11px] font-bold text-emerald-100 uppercase tracking-wider">Transaction Approved</p>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-rose-200" />
                <p className="text-[11px] font-bold text-rose-100 uppercase tracking-wider">Transaction Failed</p>
              </div>
            )}

            <h2 className="text-3xl font-extrabold tracking-tight mt-1">
              ₹{config.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h2>
            <p className="text-[10px] text-white/70 mt-1 truncate max-w-xs font-medium">
              to: {config.merchantName}
            </p>
          </div>
        </div>

        {/* Floating Transaction State Alert */}
        <div className="px-4 -mt-3.5 z-10">
          <div className={`rounded-xl border p-3 shadow-xs ${statusStyle.bg} ${statusStyle.text} transition-all duration-300`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  config.status === 'Success' ? 'bg-emerald-500 animate-pulse' : config.status === 'Failed' ? 'bg-rose-500' : 'bg-blue-500 animate-pulse'
                }`} />
                <p className="text-xs font-bold uppercase tracking-wider">
                  Status: {config.status}
                </p>
              </div>
              {config.status !== 'Pending' && (
                <button
                  onClick={onResetStatus}
                  className="p-1 rounded-md hover:bg-slate-200/50 transition-colors text-slate-500 cursor-pointer flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
                  title="Reset status to Pending"
                >
                  <RefreshCw className="w-3 h-3" /> Re-Pay
                </button>
              )}
            </div>
            <p className="text-[10px] mt-1 text-slate-500 font-medium">{statusStyle.desc}</p>
            {selectedAppUsed && config.status === 'Success' && (
              <p className="text-[9px] mt-0.5 font-semibold text-emerald-600">
                Processed via {selectedAppUsed}
              </p>
            )}
          </div>
        </div>

        {/* 3. Main Body Core */}
        <div className="px-4 mt-4 space-y-4">
          
          {/* Card: Payee Profile */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Payee Merchant</span>
              <span className="text-[9px] font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">UPI Verified</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Profile Avatar */}
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-extrabold text-sm shadow-xs shrink-0 select-none">
                {config.merchantName.split(' ').map(n => n[0]).join('')}
              </div>

              {/* Text metadata */}
              <div className="flex-1 overflow-hidden">
                <h3 className="font-extrabold text-slate-800 text-sm tracking-tight truncate">{config.merchantName}</h3>
                
                {/* UPI Address Badge */}
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-slate-400 text-[10px] font-mono truncate">{config.upiId}</span>
                  <button
                    onClick={onCopyUPI}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-all cursor-pointer relative"
                    title="Copy UPI Address"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Note details */}
            {config.note && (
              <div className="mt-3.5 pt-3 border-t border-gray-100 flex justify-between items-center text-[11px]">
                <span className="text-gray-400">Description Note</span>
                <span className="text-slate-700 font-semibold truncate max-w-[180px]">{config.note}</span>
              </div>
            )}
          </div>

          {/* Card: Interactive UPI QR Code */}
          <UPIQRCode
            upiLink={upiLink}
            amount={config.amount}
            merchantName={config.merchantName}
          />

          {/* Secure Transaction Log Cards */}
          <div className="bg-white rounded-2xl border border-gray-100 p-3.5 space-y-2.5 shadow-2xs">
            <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider pb-1.5 border-b border-gray-100">
              <span>Transaction Log</span>
              <Lock className="w-3 h-3 text-emerald-500" />
            </div>

            <div className="grid grid-cols-2 gap-y-2 text-[11px]">
              <div className="flex flex-col">
                <span className="text-gray-400">Ref ID</span>
                <span className="font-mono text-slate-700 font-medium truncate">{config.transactionId}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-gray-400">Timestamp</span>
                <span className="text-slate-700 font-medium">{config.timestamp.split(',')[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom action dock */}
      <div className="p-4 bg-white border-t border-gray-100/80 shadow-lg flex flex-col gap-2.5 z-10">
        <button
          onClick={onOpenChooser}
          className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-extrabold py-3.5 px-5 rounded-2xl text-xs tracking-wide transition-all shadow-md hover:shadow-blue-200 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <Smartphone className="w-4.5 h-4.5 stroke-[2.5]" />
          Open Payment App
          <ArrowUpRight className="w-4.5 h-4.5 stroke-[2.5]" />
        </button>

        <div className="flex justify-center items-center gap-1 text-[10px] text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>NPCI Unified Payments Secure Protocol</span>
        </div>
      </div>

      {/* Home Swipe Indicator on mobile */}
      <div className="w-full bg-white pb-2 flex justify-center">
        <div className="w-28 h-1 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
}
