import { IsDate, IsIP, IsOptional, IsUUID } from 'class-validator';

export class CreateEventDto {
  @IsDate()
  @IsOptional()
  localTime: Date;

  @IsIP()
  @IsOptional()
  ip: string;

  @IsOptional()
  data?: Record<string, string | number | boolean>;

  @IsUUID()
  actionId: string;
}
