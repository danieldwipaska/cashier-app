import { ReportType } from '@prisma/client';

/**
 * Print with IWARE device
 * @param {Object} receiptData - Receipt data
 * @param {string} receiptData.storeName - Store name
 * @param {string} receiptData.address - Store Address
 * @param {Date} receiptData.date - Receipt date
 * @param {string} receiptData.receiptNumber - Receipt number
 * @param {string} receiptData.servedBy - Crew name who served
 * @param {string} receiptData.customerName - Customer name
 * @param {Object} receiptData.items - Order items
 * @param {string} receiptData.items.name - Item name
 * @param {number} receiptData.items.quantity - Item quantity or amount
 * @param {number} receiptData.items.price - Item price
 * @param {number} receiptData.items.discountPercent - Discount percentage
 * @param {number} receiptData.items.discountedPrice - Price after discount
 * @param {boolean} receiptData.includedTaxService - Whether or not the order includes tax and service
 * @param {number} receiptData.taxPercent - Tax percentage
 * @param {number} receiptData.servicePercent - Service percentage
 * @param {number} receiptData.subtotal - Receipt subtotal value
 * @param {number} receiptData.total - Receipt total value
 * @param {string} receiptData.note - Receipt total value
 * @returns {Object} { success: true/false }
 * @throws {Error} If printing error
 */
export interface ReceiptData {
  receiptType: ReportType;
  storeName: string;
  address: string;
  date: Date;
  receiptNumber: string;
  servedBy: string;
  customerName: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    discountPercent: number;
    discountedPrice: number;
  }[];
  includedTaxService: boolean;
  taxPercent: number;
  servicePercent: number;
  subtotal: number;
  total: number;
  note: string;
  cardNumber?: string;
  finalBalance?: number;
}
