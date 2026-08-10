import { Injectable, ConflictException } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { EncryptionService } from '../common/encryption/encryption.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ERRORS } from '../common/constants/errors.constant';
import { UserDocument } from './schema/user.schema';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
  ) {}

  async register(dto: RegisterUserDto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException(ERRORS.USER.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await this.encryptionService.hashPassword(
      dto.password,
    );

    const user = await this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const userObj = (user as UserDocument).toJSON();
    return plainToInstance(UserResponseDto, userObj, {
      excludeExtraneousValues: true,
    });
  }
}
