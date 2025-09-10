import { IsString, IsUUID } from 'class-validator';

export class CreateActionDto {
  @IsString()
  name: string;

  @IsUUID()
  sourceId: string;
}
