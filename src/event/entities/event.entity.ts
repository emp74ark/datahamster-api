import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Action } from '../../action/entities/action.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@Entity()
@ObjectType()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'Event ID' })
  id: string;

  @Column({ type: 'timestamp' })
  @Field(() => Date, { description: 'Event timestamp' })
  localTime: Date;

  @Column()
  @Field(() => String, { description: 'Event IP' })
  ip: string;

  @Column({ type: 'simple-json' })
  @Field(() => GraphQLJSONObject, { nullable: true, description: 'Event data' })
  data?: Record<string, string | number | boolean>;

  @ManyToOne(() => User, (user: User) => user.events, {
    nullable: false,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  user: User;

  @ManyToOne(() => Action, (action: Action) => action.events, {
    nullable: false,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  action: Action;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  @Field(() => Date, { description: 'Event creation date' })
  createdAt: Date;
}
