export enum ReportType {
  TOPUP_AND_ACTIVATE = 'topup_and_activate',
  TOPUP = 'topup',
  PAY = 'pay',
  CHECKOUT = 'checkout',
  ADJUSTMENT = 'adjustment',
  REFUND = 'refund',
}

export enum ReportStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
  CANCELLED = 'cancelled',
}
