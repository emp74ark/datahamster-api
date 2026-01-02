import { PartialType } from '@nestjs/mapped-types';
import { CreateActionDto } from './create-action.dto';
import {
  Field,
  InputType,
  PartialType as PartialGqlType,
} from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateActionDto extends PartialType(CreateActionDto) {}

@InputType()
export class ChangeActionDto extends PartialGqlType(CreateActionDto) {
  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
