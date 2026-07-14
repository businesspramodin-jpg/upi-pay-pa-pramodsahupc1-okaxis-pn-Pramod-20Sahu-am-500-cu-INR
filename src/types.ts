/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionStatus = 'Pending' | 'Success' | 'Failed';

export interface MerchantConfig {
  upiId: string;
  merchantName: string;
  amount: number;
  note: string;
  currency: string;
  transactionId: string;
  status: TransactionStatus;
  timestamp: string;
}

export interface UPIApp {
  id: string;
  name: string;
  packageName: string;
  iconBg: string;
  color: string;
  deepLinkPrefix: string;
}
