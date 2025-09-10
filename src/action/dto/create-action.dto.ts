import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateActionDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  events?: string[];
}
