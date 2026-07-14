/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UPIApp, MerchantConfig } from './types';

export const UPI_APPS: UPIApp[] = [
  {
    id: 'gpay',
    name: 'Google Pay',
    packageName: 'com.google.android.apps.nbu.paisa.user',
    iconBg: 'bg-white border border-gray-100',
    color: '#1A73E8', // Google Blue
    deepLinkPrefix: 'gpay://pay'
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    packageName: 'com.phonepe.app',
    iconBg: 'bg-[#5f259f]', // PhonePe Purple
    color: '#5f259f',
    deepLinkPrefix: 'phonepe://pay'
  },
  {
    id: 'paytm',
    name: 'Paytm',
    packageName: 'net.one97.paytm',
    iconBg: 'bg-[#00b9f5]', // Paytm Blue
    color: '#00b9f5',
    deepLinkPrefix: 'paytmmp://pay'
  },
  {
    id: 'bhim',
    name: 'BHIM UPI',
    packageName: 'in.org.npci.upiapp',
    iconBg: 'bg-gradient-to-tr from-[#f15a24] to-[#00aeef]', // BHIM Orange-Blue
    color: '#1d2c5c',
    deepLinkPrefix: 'bhim://pay'
  },
  {
    id: 'amazonpay',
    name: 'Amazon Pay',
    packageName: 'in.amazon.mShop.android.shopping',
    iconBg: 'bg-[#ff9900]', // Amazon Orange
    color: '#ff9900',
    deepLinkPrefix: 'amazonpay://pay'
  },
  {
    id: 'cred',
    name: 'CRED Pay',
    packageName: 'com.dreamplug.android.cred',
    iconBg: 'bg-[#000000]', // CRED Black
    color: '#000000',
    deepLinkPrefix: 'cred://pay'
  }
];

export const DEFAULT_MERCHANT: MerchantConfig = {
  upiId: 'pramodsahupc1@okaxis',
  merchantName: 'Pramod Sahu',
  amount: 500,
  note: 'Payment for Services',
  currency: 'INR',
  transactionId: 'TXN' + Math.floor(100000 + Math.random() * 900000),
  status: 'Pending',
  timestamp: new Date().toLocaleString()
};

export const PRESET_AMOUNTS = [100, 250, 500, 1000, 2500, 5000];

export const PRESET_MERCHANTS = [
  { name: 'Pramod Sahu', upi: 'pramodsahupc1@okaxis', note: 'Project Design Fee' },
  { name: 'Aroma Cafe', upi: 'cafe.aroma@okaxis', note: 'Sunday Brunch bill' },
  { name: 'QuickMart Groceries', upi: 'quickmart@okicici', note: 'Monthly Groceries' },
  { name: 'TechLabs Consulting', upi: 'techlabs@okhdfcbank', note: 'Server Deployment' }
];
