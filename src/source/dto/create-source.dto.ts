import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSourceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  sourceId: string;
}
