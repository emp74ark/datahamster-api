import { IsDate, IsIP, IsOptional, IsUUID } from 'class-validator';

export class CreatePublicDto {
  @IsUUID()
  id: string;

  @IsDate()
  @IsOptional()
  localTime: Date;

  @IsIP()
  @IsOptional()
  ip: string;

  @IsOptional()
  data: Record<string, string | number | boolean>;
}
