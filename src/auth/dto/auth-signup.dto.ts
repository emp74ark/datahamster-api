import { IsEmail, IsNotEmpty } from 'class-validator';
import { AuthLoginDto } from './auth-login.dto';

export class AuthSignupDto extends AuthLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
