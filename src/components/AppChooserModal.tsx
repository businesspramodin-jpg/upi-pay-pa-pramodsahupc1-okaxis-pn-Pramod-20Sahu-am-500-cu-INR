/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Landmark, Smartphone, AlertCircle, ArrowLeft, Loader2, CheckCircle2, AlertOctagon } from 'lucide-react';
import { useState } from 'react';
import { MerchantConfig, UPIApp } from '../types';
import { UPI_APPS } from '../constants';

interface AppChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: MerchantConfig;
  onPaymentComplete: (status: 'Success' | 'Failed', appUsed: string) => void;
  upiLink: string;
}

type ModalScreen = 'chooser' | 'connecting' | 'secure_pay' | 'processing' | 'result';

export default function AppChooserModal({
  isOpen,
  onClose,
  config,
  onPaymentComplete,
  upiLink
}: AppChooserModalProps) {
  const [selectedApp, setSelectedApp] = useState<UPIApp | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ModalScreen>('chooser');
  const [authPin, setAuthPin] = useState<string>('');
  const [resultStatus, setResultStatus] = useState<'Success' | 'Failed' | null>(null);

  const resetModal = () => {
    setSelectedApp(null);
    setCurrentScreen('chooser');
    setAuthPin('');
    setResultStatus(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const selectApp = (app: UPIApp) => {
    setSelectedApp(app);
    setCurrentScreen('connecting');
    // Simulate connection delay
    setTimeout(() => {
      setCurrentScreen('secure_pay');
    }, 1500);
  };

  // Launch the actual deep link
  const launchActualDeepLink = () => {
    if (!selectedApp) return;
    // Replace prefix if appropriate or just open the global upi:// link
    // Deep links require native handling, but triggering it opens the system app
    window.location.href = upiLink;
  };

  const handleAuthorize = (status: 'Success' | 'Failed') => {
    setCurrentScreen('processing');
    setTimeout(() => {
      setResultStatus(status);
      setCurrentScreen('result');
      onPaymentComplete(status, selectedApp?.name || 'UPI App');
    }, 2000);
  };

  const handlePinInput = (num: string) => {
    if (authPin.length < 4) {
      setAuthPin((prev) => prev + num);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end justify-center md:items-center"
          />

          {/* Bottom Sheet Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl z-50 overflow-hidden md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:rounded-3xl border border-gray-100"
            style={{ maxHeight: '90vh' }}
          >
            {/* MD3 Grab Handle (only visible on mobile layout) */}
            <div className="w-full flex justify-center py-3 md:hidden">
              <div className="w-10 h-1.5 bg-gray-200 rounded-full" />
            </div>

            {/* SCREEN 1: Choose App */}
            {currentScreen === 'chooser' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                      Open Payment App
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Choose an app to complete transaction</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Info summary */}
                <div className="bg-slate-50/80 rounded-xl p-3.5 mb-5 border border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Merchant Payee</span>
                    <p className="text-sm font-semibold text-slate-800">{config.merchantName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{config.upiId}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Amount</span>
                    <p className="text-lg font-extrabold text-blue-600">₹{config.amount.toFixed(2)}</p>
                  </div>
                </div>

                {/* List of Apps */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {UPI_APPS.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => selectApp(app)}
                      className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 bg-white hover:border-blue-500 hover:bg-blue-50/10 transition-all text-left group cursor-pointer"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${app.iconBg} shrink-0 shadow-xs font-bold text-white text-xs`}>
                        {app.name === 'Google Pay' && <span className="text-blue-600">G</span>}
                        {app.name === 'PhonePe' && <span>P</span>}
                        {app.name === 'Paytm' && <span>Py</span>}
                        {app.name === 'BHIM UPI' && <span className="text-xs bg-slate-800/10 p-0.5 rounded">UPI</span>}
                        {app.name === 'Amazon Pay' && <span>A</span>}
                        {app.name === 'CRED Pay' && <span className="tracking-tighter">C</span>}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                          {app.name}
                        </p>
                        <p className="text-[9px] text-slate-400 truncate font-mono">
                          {app.packageName.substring(0, 15)}...
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Note about real deep linking */}
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 flex gap-2 items-start">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-amber-700 leading-normal">
                    <span className="font-bold">Developer Notice:</span> Tapping any app simulates a secure transaction. To launch the real deep link intent directly to your mobile's app chooser, use the launch option below.
                  </div>
                </div>

                <button
                  onClick={launchActualDeepLink}
                  className="w-full mt-4 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  Launch Native Android Intent
                </button>
              </div>
            )}

            {/* SCREEN 2: Connecting */}
            {currentScreen === 'connecting' && (
              <div className="p-10 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <h4 className="text-base font-bold text-slate-800">Connecting to {selectedApp?.name}</h4>
                <p className="text-xs text-slate-500 mt-2">Setting up secure encryption tunnel...</p>
                <div className="flex items-center gap-1.5 mt-8 px-3 py-1.5 rounded-full bg-emerald-50 text-[10px] text-emerald-600 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  SSL Secured • 256-Bit Key Exchange
                </div>
              </div>
            )}

            {/* SCREEN 3: Secure UPI PIN Interface */}
            {currentScreen === 'secure_pay' && (
              <div className="p-6 bg-slate-900 text-white">
                <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={() => setCurrentScreen('chooser')}
                    className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase bg-slate-800 px-2 py-0.5 rounded">UPI PIN Authentication</span>
                  </div>
                  <div className="w-8" />
                </div>

                {/* Amount display */}
                <div className="text-center mb-6">
                  <p className="text-xs text-slate-400">Paying to <span className="text-emerald-400 font-medium">{config.merchantName}</span></p>
                  <h3 className="text-3xl font-extrabold text-white mt-1">₹{config.amount.toFixed(2)}</h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">Txn: {config.transactionId}</p>
                </div>

                {/* PIN Display */}
                <div className="flex flex-col items-center mb-8">
                  <p className="text-xs text-slate-400 mb-3">Enter 4-Digit UPI PIN</p>
                  <div className="flex gap-4">
                    {[0, 1, 2, 3].map((idx) => (
                      <div
                        key={idx}
                        className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                          authPin.length > idx ? 'bg-emerald-500 border-emerald-500 scale-110' : 'border-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Pad */}
                <div className="grid grid-cols-3 gap-y-4 gap-x-8 max-w-xs mx-auto mb-6">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                    <button
                      key={num}
                      onClick={() => handlePinInput(num)}
                      className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-base font-bold flex items-center justify-center cursor-pointer select-none mx-auto"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={() => setAuthPin('')}
                    className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center justify-center select-none"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => handlePinInput('0')}
                    className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-base font-bold flex items-center justify-center cursor-pointer select-none mx-auto"
                  >
                    0
                  </button>
                  <button
                    onClick={() => setAuthPin('••••')}
                    className="text-xs text-slate-400 hover:text-slate-300 font-bold flex items-center justify-center select-none"
                  >
                    Auto
                  </button>
                </div>

                {/* Authorization Options */}
                <div className="flex gap-3 mt-6">
                  <button
                    disabled={authPin.length < 4 && authPin !== '••••'}
                    onClick={() => handleAuthorize('Success')}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs cursor-pointer text-center transition-all ${
                      authPin.length === 4 || authPin === '••••'
                        ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-[0.98]'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Pay & Authorize Success
                  </button>
                  <button
                    disabled={authPin.length < 4 && authPin !== '••••'}
                    onClick={() => handleAuthorize('Failed')}
                    className={`py-3 px-4 rounded-xl font-bold text-xs cursor-pointer text-center transition-all ${
                      authPin.length === 4 || authPin === '••••'
                        ? 'bg-rose-500/25 text-rose-400 hover:bg-rose-500/45'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Simulate Failure
                  </button>
                </div>

                <div className="flex justify-center items-center gap-1 mt-6 text-[10px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Secure bank-grade multi-factor system</span>
                </div>
              </div>
            )}

            {/* SCREEN 4: Processing */}
            {currentScreen === 'processing' && (
              <div className="p-10 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mb-5" />
                <h4 className="text-lg font-bold text-slate-800">Processing UPI Transaction</h4>
                <p className="text-xs text-slate-400 mt-1">Verifying UPI PIN with central NPCI servers...</p>
                <p className="text-xs text-slate-400 mt-0.5">Updating double-entry ledger vaults...</p>
              </div>
            )}

            {/* SCREEN 5: Result page inside sheet */}
            {currentScreen === 'result' && (
              <div className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  {resultStatus === 'Success' ? (
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                      <AlertOctagon className="w-12 h-12" />
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-black text-slate-800">
                  {resultStatus === 'Success' ? 'Payment Approved!' : 'Payment Failed'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {resultStatus === 'Success' 
                    ? `Successfully sent to ${config.merchantName}`
                    : 'The bank declined the transaction or network timed out.'}
                </p>

                <div className="my-6 bg-slate-50 rounded-xl p-4 border border-slate-100 text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200/60 text-xs">
                    <span className="text-slate-400">Merchant Payee</span>
                    <span className="font-semibold text-slate-800">{config.merchantName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200/60 text-xs">
                    <span className="text-slate-400">Transaction ID</span>
                    <span className="font-mono text-slate-700">{config.transactionId}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 text-xs">
                    <span className="text-slate-400">Amount Charged</span>
                    <span className="font-extrabold text-slate-800">₹{config.amount.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className={`w-full py-3.5 rounded-xl text-white font-extrabold text-sm transition-all cursor-pointer shadow-xs ${
                    resultStatus === 'Success' 
                      ? 'bg-emerald-600 hover:bg-emerald-500 hover:shadow-md' 
                      : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
