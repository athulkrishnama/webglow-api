import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProviderServiceRepository } from './provider-service.repository';
import { MongooseBaseRepository } from '../../common/repository/mongo/mongooseBase.repository';
import {
  ProviderService,
  ProviderServiceDocument,
} from '../schema/provider-service.schema';

@Injectable()
export class MongooseProviderServiceRepository
  extends MongooseBaseRepository<ProviderServiceDocument>
  implements ProviderServiceRepository
{
  constructor(
    @InjectModel(ProviderService.name)
    protected readonly model: Model<ProviderServiceDocument>,
  ) {
    super(model);
  }
}
