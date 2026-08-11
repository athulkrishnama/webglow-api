import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ROUTES } from '../common/constants/routes.constant';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import type { Response, Request } from 'express';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { RESPONSE_MESSAGES } from '../common/constants/response-messages.constant';

@Controller(ROUTES.USER.BASE)
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post(ROUTES.USER.REGISTER)
  @ResponseMessage(RESPONSE_MESSAGES.USER.REGISTER_SUCCESS)
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this._userService.register(registerUserDto);
  }

  @Post(ROUTES.USER.LOGIN)
  @ResponseMessage(RESPONSE_MESSAGES.USER.LOGIN_SUCCESS)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this._userService.login(loginUserDto);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { user, accessToken };
  }

  @Post(ROUTES.USER.REFRESH_TOKEN)
  @ResponseMessage(RESPONSE_MESSAGES.USER.REFRESH_TOKEN_SUCCESS)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenCookie = req.cookies?.refresh_token;

    const { accessToken, refreshToken } =
      await this._userService.refreshToken(refreshTokenCookie);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }
}
