export class CreateReportDto {
  customerName?: string;
  collectedBy: string;
  totalPayment: number;
  paymentMethod: string;
  orderId: string[];
  orderName: string[];
  orderCategory: string[];
  orderPrice: number[];
  orderAmount: number[];
  note?: string;
}
