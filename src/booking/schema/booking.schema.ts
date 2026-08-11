import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BookingDocument = HydratedDocument<Booking>;

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ProviderService', required: true })
  serviceId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  providerId: Types.ObjectId;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  numberOfDays: number;

  @Prop({ required: true })
  pricePerDay: number;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({
    type: String,
    enum: BookingStatus,
    default: BookingStatus.CONFIRMED,
  })
  status: BookingStatus;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
