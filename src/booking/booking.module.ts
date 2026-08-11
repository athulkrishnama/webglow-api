import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking, BookingSchema } from './schema/booking.schema';
import { BookingRepository } from './repository/booking.repository';
import { MongooseBookingRepository } from './repository/mongoose-booking.repository';
import { ProviderServiceModule } from '../provider-service/provider-service.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
      }),
    }),
    ProviderServiceModule,
  ],
  controllers: [BookingController],
  providers: [
    BookingService,
    {
      provide: BookingRepository,
      useClass: MongooseBookingRepository,
    },
  ],
})
export class BookingModule {}
