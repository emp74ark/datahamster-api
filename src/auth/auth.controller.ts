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
import { AuthSession } from './auth.types';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Login' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async login(@Body() dto: AuthLoginDto, @Session() session: AuthSession) {
    const user = await this.authService.login({ dto });
    console.debug('CONTROLLER_USER', user);
    if (user) {
      console.debug('CONTROLLER_ADD_TO_SESSION', user);
      const { id, role } = user;
      session.user = { id, role };
    }
    return user;
  }

  @ApiOperation({ summary: 'Signup' })
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  async signup(@Body() dto: AuthSignupDto, @Session() session: AuthSession) {
    const user = await this.authService.signup({ dto });
    if (user) {
      const { id, role } = user;
      session.user = { id, role };
    }
    return user;
  }

  @ApiOperation({ summary: 'Logout' })
  @UseGuards(SessionGuard)
  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        throw new InternalServerErrorException('Error logging out');
      }
      res
        .clearCookie(
          this.configService.get<string>('COOKIE_NAME') || 'datahamster.sid',
        )
        .status(HttpStatus.OK)
        .json({ message: 'Successfully logged out' });
    });
  }
}
