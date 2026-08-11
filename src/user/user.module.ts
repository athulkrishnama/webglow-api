import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schema/user.schema';
import { UserRepository } from './repository/user.repository';
import { MongooseUserRepository } from './repository/mongoose-user.repository';
import { EncryptionModule } from '../common/encryption/encryption.module';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    EncryptionModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: UserRepository,
      useClass: MongooseUserRepository,
    },
    UserService,
  ],
  exports: [UserRepository],
})
export class UserModule {}
