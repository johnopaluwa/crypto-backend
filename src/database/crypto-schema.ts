import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CryptoDocument = CryptoData & Document;

@Schema()
export class CryptoData {
  @Prop()
  name: string;

  @Prop()
  value: [];
}

export const CryptoSchema = SchemaFactory.createForClass(CryptoData);
