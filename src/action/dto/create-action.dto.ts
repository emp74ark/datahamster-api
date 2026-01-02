import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateActionDto {
  @ApiProperty({ example: 'My action' })
  @Field()
  @IsString()
  name: string;

  @ApiProperty({ example: '60284400-531b-4c04-b528-b5c9fc140af9' })
  @Field()
  @IsUUID()
  sourceId: string;
}
