import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @ApiProperty({ example: 'guillerminak' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'u9mQM8p9h6fNo4cEj58gAH2' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
