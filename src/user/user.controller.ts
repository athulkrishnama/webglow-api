import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { ROUTES } from '../common/constants/routes.constant';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller(ROUTES.USER.BASE)
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post(ROUTES.USER.REGISTER)
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this._userService.register(registerUserDto);
  }
}
