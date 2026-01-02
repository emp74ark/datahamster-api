import { IsEmail, IsNotEmpty } from 'class-validator';
import { AuthLoginDto } from './auth-login.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AuthSignupDto extends AuthLoginDto {
  @ApiProperty({ example: 'tequan_ramager@select.uu' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
