export interface IOrderDiscountedPrice {
  price: number;
  amount: number;
  discountPercent: number;
}

export interface ICalculateTaxService {
  totalPayment: number;
  servicePercent: number;
  taxPercent: number;
}
