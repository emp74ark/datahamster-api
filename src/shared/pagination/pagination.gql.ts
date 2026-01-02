import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Paginated } from './paginataion.types';

export function PaginatedResults<T>(classRef: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class Results implements Paginated<T> {
    @Field(() => Int)
    total: number;

    @Field(() => [classRef], { nullable: true })
    results: T[];
  }

  return Results as Type<Paginated<T>>;
}
