import Order from 'src/interfaces/order.interface';

export class CreateReportDto {
  customerName?: string;
  collectedBy: string;
  totalPayment: number;
  paymentMethod: string;
  orders: Order[];
  note?: string;
}
