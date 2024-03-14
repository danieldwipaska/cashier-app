import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FnbDocument = HydratedDocument<Fnb>;

@Schema()
export class Fnb {
  @Prop()
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  availability: boolean;

  @Prop()
  createdAt: number;

  @Prop()
  updatedAt: number;
}

export const FnbSchema = SchemaFactory.createForClass(Fnb);
