import { IsDate, IsIP, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePublicDto {
  @ApiProperty({ example: '60284400-531b-4c04-b528-b5c9fc140af9' })
  @IsUUID()
  id: string;

  @ApiProperty({ example: '2025-10-09T10:05:14.055Z' })
  @IsDate()
  @IsOptional()
  localTime: Date;

  @ApiProperty({ example: '192.168.1.1' })
  @IsIP()
  @IsOptional()
  ip: string;

  @ApiProperty({ example: '{"key": "value"}' })
  @IsOptional()
  data: Record<string, string | number | boolean>;
}
