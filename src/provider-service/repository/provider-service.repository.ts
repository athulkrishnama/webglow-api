import { BaseRepository } from '../../common/repository/base.repository';
import { ProviderService } from '../schema/provider-service.schema';
import type {
  PaginatedResult,
  ServiceFilterOptions,
} from '../../common/interfaces/pagination.interface';

export abstract class ProviderServiceRepository extends BaseRepository<ProviderService> {
  abstract findServices(
    filters: ServiceFilterOptions,
  ): Promise<PaginatedResult<ProviderService>>;
}
