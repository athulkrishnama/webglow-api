import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProviderServiceRepository } from './provider-service.repository';
import { MongooseBaseRepository } from '../../common/repository/mongo/mongooseBase.repository';
import {
  ProviderService,
  ProviderServiceDocument,
} from '../schema/provider-service.schema';
import type {
  PaginatedResult,
  ServiceFilterOptions,
} from '../../common/interfaces/pagination.interface';

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

  async findServices(
    filters: ServiceFilterOptions,
  ): Promise<PaginatedResult<ProviderService>> {
    const {
      providerId,
      isActive,
      category,
      minPrice,
      maxPrice,
      lat,
      lng,
      radiusKm = 50,
      availableFrom,
      availableTo,
      page = 1,
      limit = 10,
      search,
    } = filters;

    const query: Record<string, unknown> = {};

    if (providerId !== undefined) {
      query.providerId = new Types.ObjectId(providerId);
    }

    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};
      if (minPrice !== undefined) priceFilter.$gte = minPrice;
      if (maxPrice !== undefined) priceFilter.$lte = maxPrice;
      query.pricePerDay = priceFilter;
    }

    if (lat !== undefined && lng !== undefined) {
      query['location'] = {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radiusKm * 1000, // convert km to meters
        },
      };
    }

    if (availableFrom && availableTo) {
      query.availability = {
        $elemMatch: {
          startDate: { $lte: availableTo },
          endDate: { $gte: availableFrom },
        },
      };
    }

    const skip = (page - 1) * limit;

    const countQuery = { ...query };
    if (lat !== undefined && lng !== undefined) {
      countQuery['location'] = {
        $geoWithin: {
          $centerSphere: [[lng, lat], radiusKm / 6378.1],
        },
      };
    }

    const [data, total] = await Promise.all([
      this.model.find(query).skip(skip).limit(limit).lean().exec(),
      this.model.countDocuments(countQuery).exec(),
    ]);

    return {
      data: data as unknown as ProviderService[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
