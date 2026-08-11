import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ROUTES } from '../common/constants/routes.constant';
import { RESPONSE_MESSAGES } from '../common/constants/response-messages.constant';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLES } from '../common/constants/roles.constant';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@Controller(ROUTES.BOOKING.BASE)
export class BookingController {
  constructor(private readonly _bookingService: BookingService) {}

  @Post(ROUTES.BOOKING.CREATE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.USER)
  @ResponseMessage(RESPONSE_MESSAGES.BOOKING.CREATE_SUCCESS)
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this._bookingService.createBooking(user.sub, createBookingDto);
  }

  @Get(ROUTES.BOOKING.MY_BOOKINGS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.USER)
  @ResponseMessage(RESPONSE_MESSAGES.BOOKING.MY_LIST_SUCCESS)
  async getMyBookings(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this._bookingService.getMyBookings(
      user.sub,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Get(ROUTES.BOOKING.AVAILABLE_DATES)
  @ResponseMessage(RESPONSE_MESSAGES.BOOKING.AVAILABLE_DATES_SUCCESS)
  async getAvailableDates(@Param('serviceId') serviceId: string) {
    return this._bookingService.getAvailableDates(serviceId);
  }

  @Get(ROUTES.BOOKING.PROVIDER_BOOKINGS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PROVIDER)
  @ResponseMessage(RESPONSE_MESSAGES.BOOKING.PROVIDER_LIST_SUCCESS)
  async getProviderBookings(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this._bookingService.getProviderBookings(
      user.sub,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Get(ROUTES.BOOKING.ADMIN_BOOKINGS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ResponseMessage(RESPONSE_MESSAGES.BOOKING.ADMIN_LIST_SUCCESS)
  async getAllBookings(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this._bookingService.getAllBookings(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Patch(ROUTES.BOOKING.CANCEL)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.USER)
  @ResponseMessage(RESPONSE_MESSAGES.BOOKING.CANCEL_SUCCESS)
  async cancelBooking(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this._bookingService.cancelBooking(id, user.sub);
  }
}
