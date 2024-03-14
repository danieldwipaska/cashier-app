import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  @Prop()
  id: UUID;

  @Prop({ required: true })
  name: string;

  @Prop()
  createdAt: number;

  @Prop()
  updatedAt: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
