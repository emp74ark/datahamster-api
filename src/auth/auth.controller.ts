import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: AuthLoginDto,
    @Session() session: Record<string, unknown>,
  ) {
    const user = await this.authService.login({ dto });
    session.user = user;
    return user;
  }

  @Post('signup')
  async signup(
    @Body() dto: AuthSignupDto,
    @Session() session: Record<string, unknown>,
  ) {
    const user = await this.authService.signup({ dto });
    session.user = user;
    return user;
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        throw new InternalServerErrorException('Error logging out');
      }
    });
    return res
      .clearCookie('connect.sid')
      .status(HttpStatus.OK)
      .json({ message: 'Successfully logged out' });
  }
}
