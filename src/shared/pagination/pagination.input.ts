import { Field, InputType, Int } from '@nestjs/graphql';
import { PaginationParams, SortOrder } from './paginataion.types';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export class PaginationInput implements PaginationParams {
  @Field(() => Int, { nullable: true, description: 'Page number' })
  @IsOptional()
  @IsInt()
  pageNumber?: number;

  @Field(() => Int, { nullable: true, description: 'Items per page' })
  @IsOptional()
  @IsInt()
  perPage?: number;

  @Field(() => String, { nullable: true, description: 'Field to sort by' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Order: `ASC` or `DESC`',
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}
