import { Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ProviderServiceRepository } from './repository/provider-service.repository';
import { CreateProviderServiceDto } from './dto/create-provider-service.dto';
import { ProviderService } from './schema/provider-service.schema';
import { ERRORS } from '../common/constants/errors.constant';

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
}
