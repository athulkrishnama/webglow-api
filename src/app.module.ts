import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validation';
import { ProviderServiceModule } from './provider-service/provider-service.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
      validate,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    UserModule,
    ProviderServiceModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
