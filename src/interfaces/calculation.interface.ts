export interface IOrderDiscountedPrice {
  price: number;
  amount: number;
  discountPercent: number;
}

export interface ICalculateTax {
  totalPaymentAfterService: number;
  taxPercent: number;
}

export interface ICalculateService {
  totalPayment: number;
  servicePercent: number;
}
