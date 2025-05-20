export enum ReportType {
  TOPUP_AND_ACTIVATE = 'TOPUP_AND_ACTIVATE',
  TOPUP = 'TOPUP',
  PAY = 'PAY',
  CHECKOUT = 'CHECKOUT',
  ADJUSTMENT = 'ADJUSTMENT',
  REFUND = 'REFUND',
}

export enum ReportStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  CANCELLED = 'CANCELLED',
}

export enum Position {
  SERVER = 'SERVER',
  BARTENDER = 'BARTENDER',
  GREETER = 'GREETER',
}

export enum CardStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
  EXPIRED = 'EXPIRED',
}
