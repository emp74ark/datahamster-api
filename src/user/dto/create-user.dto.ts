import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../entities/user.enums';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
