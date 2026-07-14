/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Download, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface UPIQRCodeProps {
  upiLink: string;
  amount: number;
  merchantName: string;
}

export default function UPIQRCode({ upiLink, amount, merchantName }: UPIQRCodeProps) {
  const [downloaded, setDownloaded] = useState(false);

  const downloadQRCode = () => {
    const svg = document.getElementById('upi-qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `UPI-QR-${merchantName.replace(/\s+/g, '-')}-${amount}INR.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="flex flex-col items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-xs relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full filter blur-2xl opacity-40 -mr-10 -mt-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-50 rounded-full filter blur-2xl opacity-40 -ml-10 -mb-10 pointer-events-none" />

      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
          <QrCode className="w-4.5 h-4.5" />
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Scan QR Code</p>
          <p className="text-[10px] text-gray-400">Scan using any UPI enabled payment app</p>
        </div>
      </div>

      {/* QR Code Canvas Frame */}
      <div className="relative p-4 bg-white rounded-2xl border-2 border-gray-100 shadow-sm transition-all duration-300 hover:border-blue-200">
        {/* Diagnostic Framing Corners */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-3 border-l-3 border-emerald-500 rounded-tl-sm" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-3 border-r-3 border-emerald-500 rounded-tr-sm" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-3 border-l-3 border-emerald-500 rounded-bl-sm" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-3 border-r-3 border-emerald-500 rounded-br-sm" />

        <div className="bg-white p-2 rounded-lg">
          <QRCodeSVG
            id="upi-qr-code-svg"
            value={upiLink}
            size={168}
            level="Q"
            includeMargin={false}
            fgColor="#1E293B" // Slate 800
            imageSettings={{
              src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310b981'%3E%3Cpath d='M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E",
              height: 28,
              width: 28,
              excavate: true,
            }}
          />
        </div>
      </div>

      {/* QR Actions */}
      <div className="flex gap-3 mt-4 w-full justify-center">
        <button
          onClick={downloadQRCode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer font-medium"
          title="Download QR SVG"
        >
          {downloaded ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600">Saved!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Download QR</span>
            </>
          )}
        </button>
      </div>

      {/* NPCI Trust Badges */}
      <div className="flex justify-center items-center gap-1.5 mt-4 pt-3 border-t border-gray-100 w-full text-[9px] text-gray-400 font-medium tracking-wide">
        <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">BHIM</span>
        <span className="text-gray-300">•</span>
        <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">UPI SECURE</span>
        <span className="text-gray-300">•</span>
        <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">NPCI</span>
      </div>
    </div>
  );
}
