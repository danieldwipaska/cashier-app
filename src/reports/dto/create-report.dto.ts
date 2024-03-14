export class CreateReportDto {
  customerName?: string;
  collectedBy: string;
  totalPayment: number;
  paymentMethod: string;
  orders: string;
  note?: string;
}
