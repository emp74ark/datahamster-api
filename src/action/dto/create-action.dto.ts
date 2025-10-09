import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActionDto {
  @ApiProperty({ example: 'My action' })
  @IsString()
  name: string;

  @ApiProperty({ example: '60284400-531b-4c04-b528-b5c9fc140af9' })
  @IsUUID()
  sourceId: string;
}
