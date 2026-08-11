import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { BookingRepository } from './repository/booking.repository';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus, BookingDocument } from './schema/booking.schema';
import { ProviderServiceService } from '../provider-service/provider-service.service';
import type { PaginatedResult } from '../common/interfaces/pagination.interface';
import { ERRORS } from '../common/constants/errors.constant';

@Injectable()
export class BookingService {
  constructor(
    private readonly _bookingRepo: BookingRepository,
    private readonly _providerServiceService: ProviderServiceService,
  ) {}

  async createBooking(userId: string, dto: CreateBookingDto) {
    const { serviceId, startDate: startDateStr, endDate: endDateStr } = dto;

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (startDate >= endDate) {
      throw new BadRequestException(ERRORS.BOOKING.INVALID_DATES);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      throw new BadRequestException(ERRORS.BOOKING.PAST_DATE);
    }

    const service =
      await this._providerServiceService.getBrowseServiceById(serviceId);

    if (service.providerId.toString() === userId) {
      throw new ForbiddenException(ERRORS.BOOKING.SELF_BOOKING);
    }

    const isAvailable = service.availability.some(
      (range) =>
        new Date(range.startDate) <= startDate &&
        new Date(range.endDate) >= endDate,
    );
    if (!isAvailable) {
      throw new BadRequestException(ERRORS.BOOKING.UNAVAILABLE_DATES);
    }

    const existingBookings =
      await this._bookingRepo.findActiveByServiceId(serviceId);
    const hasConflict = existingBookings.some(
      (booking) =>
        startDate < new Date(booking.endDate) &&
        endDate > new Date(booking.startDate),
    );
    if (hasConflict) {
      throw new BadRequestException(ERRORS.BOOKING.CONFLICT);
    }

    const msPerDay = 1000 * 60 * 60 * 24;
    const numberOfDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / msPerDay,
    );
    const totalAmount = numberOfDays * service.pricePerDay;

    return this._bookingRepo.create({
      userId: new Types.ObjectId(userId),
      serviceId: new Types.ObjectId(serviceId),
      providerId: service.providerId,
      startDate,
      endDate,
      numberOfDays,
      pricePerDay: service.pricePerDay,
      totalAmount,
      status: BookingStatus.CONFIRMED,
    });
  }

  async getAvailableDates(serviceId: string) {
    const service =
      await this._providerServiceService.getBrowseServiceById(serviceId);
    const activeBookings =
      await this._bookingRepo.findActiveByServiceId(serviceId);

    const availabilityRanges = service.availability.map((r) => ({
      start: new Date(r.startDate).toISOString(),
      end: new Date(r.endDate).toISOString(),
    }));

    const bookedRanges = activeBookings.map((b) => ({
      start: new Date(b.startDate).toISOString(),
      end: new Date(b.endDate).toISOString(),
    }));

    return {
      availabilityRanges,
      bookedRanges,
    };
  }

  async getMyBookings(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<PaginatedResult<BookingDocument>> {
    const { items, total } = await this._bookingRepo.findByUser(
      userId,
      page,
      limit,
    );
    const totalPages = Math.ceil(total / limit);

    return {
      data: items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getProviderBookings(
    providerId: string,
    page = 1,
    limit = 10,
  ): Promise<PaginatedResult<BookingDocument>> {
    const { items, total } = await this._bookingRepo.findByProvider(
      providerId,
      page,
      limit,
    );
    const totalPages = Math.ceil(total / limit);

    return {
      data: items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getAllBookings(
    page = 1,
    limit = 10,
  ): Promise<PaginatedResult<BookingDocument>> {
    const { items, total } = await this._bookingRepo.findAll(page, limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data: items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await this._bookingRepo.findById(bookingId);

    if (!booking) {
      throw new NotFoundException(ERRORS.BOOKING.NOT_FOUND);
    }

    if (booking.userId.toString() !== userId) {
      throw new ForbiddenException(ERRORS.BOOKING.UNAUTHORIZED_CANCEL);
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException(ERRORS.BOOKING.ALREADY_CANCELLED);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(booking.startDate) <= today) {
      throw new BadRequestException(ERRORS.BOOKING.CANCEL_STARTED);
    }

    return this._bookingRepo.cancel(bookingId);
  }
}
