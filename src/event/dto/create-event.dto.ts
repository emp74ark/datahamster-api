import { IsDate, IsIP, IsJSON, IsOptional, IsUUID } from 'class-validator';

export class CreateEventDto {
  @IsDate()
  @IsOptional()
  localTime: Date;

  @IsIP()
  @IsOptional()
  ip: string;

  @IsJSON()
  @IsOptional()
  data?: string;

  @IsUUID()
  actionId: string;
}
