import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReportDocument = HydratedDocument<Report>;

@Schema()
export class Report {
  @Prop()
  id: string;

  @Prop()
  customerName: string;

  @Prop({ required: true })
  collectedBy: string;

  @Prop({ required: true })
  totalPayment: number;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop({ required: true })
  orders: string;

  @Prop({ required: true })
  note: string;

  @Prop()
  createdAt: number;

  @Prop()
  updatedAt: number;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
