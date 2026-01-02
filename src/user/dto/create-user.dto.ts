import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../entities/user.enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'guillerminak' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'u9mQM8p9h6fNo4cEj58gAH2' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: UserRole, default: UserRole.USER })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: 'shelonda_loudermilkvwsy@costa.or' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
