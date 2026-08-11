import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ProviderServiceService } from './provider-service.service';
import { ROUTES } from '../common/constants/routes.constant';
import { CreateProviderServiceDto } from './dto/create-provider-service.dto';
import { ListServicesQueryDto } from './dto/list-services-query.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { RESPONSE_MESSAGES } from '../common/constants/response-messages.constant';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLES } from '../common/constants/roles.constant';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@Controller(ROUTES.PROVIDER_SERVICE.BASE)
export class ProviderServiceController {
  constructor(
    private readonly _providerServiceService: ProviderServiceService,
  ) {}

  @Post(ROUTES.PROVIDER_SERVICE.CREATE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PROVIDER)
  @ResponseMessage(RESPONSE_MESSAGES.PROVIDER_SERVICE.CREATE_SUCCESS)
  async createService(
    @Body() createProviderServiceDto: CreateProviderServiceDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this._providerServiceService.createService(
      createProviderServiceDto,
      user.sub,
    );
  }

  @Get(ROUTES.PROVIDER_SERVICE.MY_SERVICES)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PROVIDER)
  @ResponseMessage(RESPONSE_MESSAGES.PROVIDER_SERVICE.MY_LIST_SUCCESS)
  async getMyServices(
    @Query() query: ListServicesQueryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this._providerServiceService.getMyServices(user.sub, query);
  }

  @Get(ROUTES.PROVIDER_SERVICE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ResponseMessage(RESPONSE_MESSAGES.PROVIDER_SERVICE.ADMIN_LIST_SUCCESS)
  async getAdminServices(@Query() query: ListServicesQueryDto) {
    return this._providerServiceService.getAllServices(query);
  }

  @Get(ROUTES.PROVIDER_SERVICE.BROWSE)
  @ResponseMessage(RESPONSE_MESSAGES.PROVIDER_SERVICE.BROWSE_SUCCESS)
  async browseServices(@Query() query: ListServicesQueryDto) {
    return this._providerServiceService.browseServices(query);
  }
}
