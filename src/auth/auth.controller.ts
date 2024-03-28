import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.validateUser(username, password);
  }

  @Post('/signup')
  signUp(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.register(username, password);
  }

  @UseGuards(AuthGuard)
  @Get('/verify')
  verify() {
    return this.authService.verifyToken();
  }
}
