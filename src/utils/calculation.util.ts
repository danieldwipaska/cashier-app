import { IOrderDiscountedPrice } from 'src/interfaces/calculation.interface';

export function orderDiscountedPrice({
  price,
  amount,
  discountPercent,
}: IOrderDiscountedPrice): number {
  const result = price * amount - (price * amount * discountPercent) / 100;

  return result;
}

export class TaxService {
  constructor(
    readonly totalPayment: number,
    readonly servicePercent: number,
    readonly taxPercent: number,
  ) {}

  getService(): number {
    return (this.totalPayment * this.servicePercent) / 100;
  }

  calculateService(): number {
    return this.getService() + this.totalPayment;
  }

  getTax(): number {
    return (this.calculateService() * this.taxPercent) / 100;
  }

  calculateTax(): number {
    return this.getTax() + this.calculateService();
  }
}
