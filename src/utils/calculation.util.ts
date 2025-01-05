import {
  ICalculateTaxService,
  IOrderDiscountedPrice,
} from 'src/interfaces/calculation.interface';

export default function orderDiscountedPrice({
  price,
  amount,
  discountPercent,
}: IOrderDiscountedPrice): number {
  const result = price * amount - (price * amount * discountPercent) / 100;

  return result;
}

export const calculateTaxService = ({
  totalPayment,
  servicePercent,
  taxPercent,
}: ICalculateTaxService) => {
  const result =
    ((totalPayment * servicePercent) / 100 + totalPayment) * (taxPercent / 100);

  return result;
};
