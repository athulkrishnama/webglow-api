import { Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ProviderServiceRepository } from './repository/provider-service.repository';
import { CreateProviderServiceDto } from './dto/create-provider-service.dto';
import { ListServicesQueryDto } from './dto/list-services-query.dto';
import { ProviderService } from './schema/provider-service.schema';
import { ERRORS } from '../common/constants/errors.constant';
import type {
  PaginatedResult,
  ServiceFilterOptions,
} from '../common/interfaces/pagination.interface';

@Injectable()
export class ProviderServiceService {
  constructor(
    private readonly _providerServiceRepo: ProviderServiceRepository,
  ) {}

  async createService(
    createProviderServiceDto: CreateProviderServiceDto,
    providerId: string,
  ): Promise<ProviderService> {
    try {
      const { availability, ...rest } = createProviderServiceDto;

      return await this._providerServiceRepo.create({
        ...rest,
        providerId: new Types.ObjectId(providerId),
        ...(availability && {
          availability: availability.map((a) => ({
            startDate: new Date(a.startDate),
            endDate: new Date(a.endDate),
          })),
        }),
      });
    } catch (error) {
      throw new BadRequestException(
        `${ERRORS.PROVIDER_SERVICE.CREATE_FAILED}: ${(error as Error).message}`,
      );
    }
  }

  async getMyServices(
    providerId: string,
    query: ListServicesQueryDto,
  ): Promise<PaginatedResult<ProviderService>> {
    try {
      return await this._providerServiceRepo.findServices(
        this._buildFilters(query, { providerId }),
      );
    } catch (error) {
      throw new BadRequestException(
        `${ERRORS.PROVIDER_SERVICE.LIST_FAILED}: ${(error as Error).message}`,
      );
    }
  }

  async getAllServices(
    query: ListServicesQueryDto,
  ): Promise<PaginatedResult<ProviderService>> {
    try {
      return await this._providerServiceRepo.findServices(
        this._buildFilters(query),
      );
    } catch (error) {
      throw new BadRequestException(
        `${ERRORS.PROVIDER_SERVICE.LIST_FAILED}: ${(error as Error).message}`,
      );
    }
  }

  async browseServices(
    query: ListServicesQueryDto,
  ): Promise<PaginatedResult<ProviderService>> {
    try {
      return await this._providerServiceRepo.findServices(
        this._buildFilters(query, { isActive: true }),
      );
    } catch (error) {
      throw new BadRequestException(
        `${ERRORS.PROVIDER_SERVICE.LIST_FAILED}: ${(error as Error).message}`,
      );
    }
  }

  private _buildFilters(
    query: ListServicesQueryDto,
    overrides: Partial<ServiceFilterOptions> = {},
  ): ServiceFilterOptions {
    return {
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 10,
      category: query.category,
      minPrice: query.minPrice ? parseFloat(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
      lat: query.lat ? parseFloat(query.lat) : undefined,
      lng: query.lng ? parseFloat(query.lng) : undefined,
      radiusKm: query.radiusKm ? parseFloat(query.radiusKm) : undefined,
      availableFrom: query.availableFrom
        ? new Date(query.availableFrom)
        : undefined,
      availableTo: query.availableTo ? new Date(query.availableTo) : undefined,
      search: query.search,
      ...overrides,
    };
  }
}
