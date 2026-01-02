import { PartialType } from '@nestjs/mapped-types';
import { CreateSourceDto } from './create-source.dto';
import {
  Field,
  InputType,
  PartialType as GqlPartialType,
} from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateSourceDto extends PartialType(CreateSourceDto) {}

@InputType()
export class ChangeSourceDto extends GqlPartialType(CreateSourceDto) {
  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
