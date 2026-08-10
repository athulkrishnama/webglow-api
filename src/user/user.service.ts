import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { EncryptionService } from '../common/encryption/encryption.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ERRORS } from '../common/constants/errors.constant';
import { UserDocument } from './schema/user.schema';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

  async login(dto: LoginUserDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException(ERRORS.USER.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await this.encryptionService.comparePassword(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(ERRORS.USER.INVALID_CREDENTIALS);
    }

    const userObj = (user as UserDocument).toJSON();
    const mappedUser = plainToInstance(UserResponseDto, userObj, {
      excludeExtraneousValues: true,
    });

    const payload = {
      sub: userObj._id,
      email: userObj.email,
      role: userObj.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return {
      user: mappedUser,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException(ERRORS.USER.REFRESH_TOKEN_REQUIRED);
    }

    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userRepository.findById(decoded.sub);
      if (!user) {
        throw new UnauthorizedException(ERRORS.USER.USER_NOT_FOUND);
      }

      const userObj = (user as UserDocument).toJSON();

      const payload = {
        sub: userObj._id,
        email: userObj.email,
        role: userObj.role,
      };

      const newAccessToken = await this.jwtService.signAsync(payload);
      const newRefreshToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException(ERRORS.USER.INVALID_REFRESH_TOKEN);
    }
  }
}
