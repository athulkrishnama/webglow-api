import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PROVIDER_CATEGORIES } from '../../common/constants/provider-categories.constant';

export type ProviderServiceDocument = HydratedDocument<ProviderService>;

@Schema({ _id: false })
class Location {
  @Prop({
    type: String,
    enum: ['Point'],
    default: 'Point',
    required: true,
  })
  type: string;

  @Prop({
    type: [Number],
    required: true,
  })
  coordinates: number[]; // [longitude, latitude]

  @Prop()
  address?: string;

  @Prop()
  city?: string;

  @Prop()
  state?: string;

  @Prop()
  zipCode?: string;
}

@Schema({ _id: false })
class Availability {
  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;
}

@Schema({ timestamps: true })
export class ProviderService {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  providerId: Types.ObjectId;

  @Prop({ required: true, enum: PROVIDER_CATEGORIES })
  category: string;

  @Prop({ required: true })
  pricePerDay: number;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Location, required: true, index: '2dsphere' })
  location: Location;

  @Prop()
  contact?: string;

  @Prop({ type: [Availability], default: [] })
  availability: Availability[];

  @Prop({ default: true })
  isActive: boolean;
}

export const ProviderServiceSchema =
  SchemaFactory.createForClass(ProviderService);
