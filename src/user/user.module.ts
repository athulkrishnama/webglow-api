import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schema/user.schema';
import { UserRepository } from './repository/user.repository';
import { MongooseUserRepository } from './repository/mongoose-user.repository';
import { EncryptionModule } from '../common/encryption/encryption.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    EncryptionModule,
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
