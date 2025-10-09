import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSourceDto {
  @ApiProperty({ example: 'My source' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'My source description' })
  @IsString()
  @IsOptional()
  description?: string;
}
