import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateSourceDto {
  @ApiProperty({ example: 'My source' })
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'My source description' })
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;
}
