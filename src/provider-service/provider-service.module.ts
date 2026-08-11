import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProviderServiceController } from './provider-service.controller';
import { ProviderServiceService } from './provider-service.service';
import {
  ProviderService,
  ProviderServiceSchema,
} from './schema/provider-service.schema';
import { ProviderServiceRepository } from './repository/provider-service.repository';
import { MongooseProviderServiceRepository } from './repository/mongoose-provider-service.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProviderService.name, schema: ProviderServiceSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
      }),
    }),
  ],
  controllers: [ProviderServiceController],
  providers: [
    ProviderServiceService,
    {
      provide: ProviderServiceRepository,
      useClass: MongooseProviderServiceRepository,
    },
  ],
  exports: [ProviderServiceService],
})
export class ProviderServiceModule {}
