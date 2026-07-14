/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MerchantConfig } from './types';
import { DEFAULT_MERCHANT } from './constants';
import PhoneMockup from './components/PhoneMockup';
import DashboardController from './components/DashboardController';
import AppChooserModal from './components/AppChooserModal';
import { Shield, Sparkles, Check, Heart, HelpCircle, Smartphone, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [config, setConfig] = useState<MerchantConfig>(DEFAULT_MERCHANT);
  const [copiedId, setCopiedId] = useState(false);
  const [showChooser, setShowChooser] = useState(false);
  const [selectedAppUsed, setSelectedAppUsed] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Encode PN for deep link specification compatibility
  const encodedMerchant = encodeURIComponent(config.merchantName);
  const upiLink = `upi://pay?pa=${config.upiId}&pn=${encodedMerchant}&am=${config.amount}&cu=${config.currency}`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(config.upiId);
    setCopiedId(true);
    triggerToast('UPI ID Copied to Clipboard!');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handlePaymentComplete = (status: 'Success' | 'Failed', appUsed: string) => {
    setConfig((prev) => ({
      ...prev,
      status,
      timestamp: new Date().toLocaleString()
    }));
    setSelectedAppUsed(appUsed);
    triggerToast(`Payment simulated as: ${status}!`);
  };

  const handleResetStatus = () => {
    setConfig((prev) => ({
      ...prev,
      status: 'Pending'
    }));
    setSelectedAppUsed(null);
    triggerToast('Payment status reset to Pending');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      
      {/* Decorative background grid and ambient lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Main Top Header Navigation */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Logo & title brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 p-[2px] shadow-sm">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center font-extrabold text-blue-600 tracking-tighter text-sm">
                UPI
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Payment System
                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Dev Workspace
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">Dynamic deep-linking and Material Design 3 mockup</p>
            </div>
          </div>

          {/* Secure gateway trust indicators */}
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-gray-100 shadow-3xs">
            <Shield className="w-4 h-4 text-emerald-500" />
            <div className="text-left">
              <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest leading-none">Security Standard</p>
              <p className="text-[11px] text-slate-700 font-medium mt-0.5">NPCI • BHIM • UPI Secure v2.0</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Work Arena */}
      <main className="max-w-7xl w-full mx-auto px-6 py-8 md:py-12 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Side: Gorgeous Smartphone Mockup */}
        <section className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
              <Smartphone className="w-3.5 h-3.5" /> Interactive Customer App Frame
            </h3>
            <p className="text-[11px] text-slate-500">View responsive changes instantly inside the smartphone preview</p>
          </div>

          {/* Device Frame */}
          <div className="relative">
            <PhoneMockup
              config={config}
              upiLink={upiLink}
              onOpenChooser={() => setShowChooser(true)}
              onCopyUPI={handleCopyUPI}
              copied={copiedId}
              onResetStatus={handleResetStatus}
              selectedAppUsed={selectedAppUsed}
            />
          </div>
        </section>

        {/* Right Side: Merchant Configuration & Simulator Panel */}
        <section className="lg:col-span-7 space-y-6 lg:sticky lg:top-28">
          <DashboardController
            config={config}
            onChange={setConfig}
            upiLink={upiLink}
          />

          {/* Guidelines and Educational Explanations */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-md space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" /> UPI Deep Linking Mechanics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-500">
              <div className="space-y-2">
                <p>
                  <strong className="text-slate-700">Native Android Intent:</strong> On Android devices, clicking the <strong className="text-slate-800">"Open Payment App"</strong> button will invoke the mobile's default UPI deep-link intent resolver.
                </p>
                <p>
                  If multiple certified apps are present (like Google Pay or PhonePe), Android automatically shows the official bottom app chooser.
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  <strong className="text-slate-700">Scan & Pay (Static/Dynamic QR):</strong> The QR code is drawn vectorially from the <code className="bg-slate-50 text-slate-700 px-1 py-0.5 rounded text-[11px] font-mono">upi://pay</code> protocol string.
                </p>
                <p>
                  Any scanner app (or mobile bank scanner) can read this QR code to automatically pre-fill payee details, amounts, and remarks instantaneously.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer copyright */}
      <footer className="w-full bg-white border-t border-gray-100 py-6 px-6 text-center text-xs text-slate-400 font-medium z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© 2026 UPI Unified Payment Gateway. Created in Developer Workspace.</p>
          <div className="flex items-center gap-1 justify-center">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>using Material Design 3 and React 19</span>
          </div>
        </div>
      </footer>

      {/* Dynamic Simulation App Chooser Bottom Sheet */}
      <AppChooserModal
        isOpen={showChooser}
        onClose={() => setShowChooser(false)}
        config={config}
        onPaymentComplete={handlePaymentComplete}
        upiLink={upiLink}
      />

      {/* Custom Floating Toast Alert */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-2.5 max-w-sm text-xs font-semibold"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <p className="flex-1">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
