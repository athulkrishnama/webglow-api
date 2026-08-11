import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ProviderServiceRepository } from './repository/provider-service.repository';
import { CreateProviderServiceDto } from './dto/create-provider-service.dto';
import { UpdateProviderServiceDto } from './dto/update-provider-service.dto';
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

  async getServiceById(
    id: string,
    providerId: string,
  ): Promise<ProviderService> {
    const service = await this._providerServiceRepo.findById(id);

    if (!service) {
      throw new NotFoundException(ERRORS.PROVIDER_SERVICE.NOT_FOUND);
    }

    if (service.providerId.toString() !== providerId) {
      throw new ForbiddenException(ERRORS.PROVIDER_SERVICE.NOT_FOUND);
    }

    return service;
  }

  async updateService(
    id: string,
    providerId: string,
    updateProviderServiceDto: UpdateProviderServiceDto,
  ): Promise<ProviderService> {
    await this.getServiceById(id, providerId);

    try {
      const { availability, ...rest } =
        updateProviderServiceDto as Partial<CreateProviderServiceDto>;
      const updatePayload: Partial<ProviderService> = { ...rest };

      if (availability !== undefined) {
        updatePayload.availability = availability.map((a) => ({
          startDate: new Date(a.startDate),
          endDate: new Date(a.endDate),
        }));
      }

      const updated = await this._providerServiceRepo.update(id, updatePayload);

      if (!updated) {
        throw new Error('Update returned null');
      }

      return updated;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `${ERRORS.PROVIDER_SERVICE.UPDATE_FAILED}: ${(error as Error).message}`,
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

  async getBrowseServiceById(id: string): Promise<ProviderService> {
    const service = await this._providerServiceRepo.findById(id);

    if (!service || !service.isActive) {
      throw new NotFoundException(ERRORS.PROVIDER_SERVICE.NOT_FOUND);
    }

    return service;
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
