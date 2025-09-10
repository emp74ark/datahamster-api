import { IsDate, IsIP, IsJSON, IsOptional } from 'class-validator';
import { JSONValue } from '../../shared/shared.types';

export class CreateEventDto {
  @IsDate()
  @IsOptional()
  localTime: Date;

  @IsIP()
  @IsOptional()
  ip: string;

  @IsJSON()
  @IsOptional()
  data: JSONValue;
}
