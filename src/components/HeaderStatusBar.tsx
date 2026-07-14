/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

export default function HeaderStatusBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // 12-hour format
      setTime(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full px-5 py-2.5 flex justify-between items-center bg-gray-50/50 backdrop-blur-xs select-none border-b border-gray-100 text-xs font-medium text-gray-500">
      {/* Time */}
      <span className="font-semibold tabular-nums text-gray-700">{time || '9:41 AM'}</span>

      {/* Notch indicator for luxury feel */}
      <div className="w-20 h-4.5 bg-gray-800 rounded-b-xl absolute top-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700/50" />
      </div>

      {/* Indicators */}
      <div className="flex items-center gap-1.5 text-gray-600">
        <span className="text-[9px] font-bold tracking-tight text-emerald-600 mr-0.5">5G</span>
        <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
        <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
        <div className="flex items-center gap-0.5">
          <Battery className="w-4 h-4 stroke-[2]" />
          <span className="text-[9px] font-bold">98%</span>
        </div>
      </div>
    </div>
  );
}
