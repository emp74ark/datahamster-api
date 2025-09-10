import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { Request, Response } from 'express';
import { SessionGuard } from './guards/session.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: AuthLoginDto,
    @Session() session: Record<string, unknown>,
  ) {
    const user = await this.authService.login({ dto });
    session.user = user;
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signup(
    @Body() dto: AuthSignupDto,
    @Session() session: Record<string, unknown>,
  ) {
    const user = await this.authService.signup({ dto });
    session.user = user;
    return user;
  }

  @UseGuards(SessionGuard)
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
