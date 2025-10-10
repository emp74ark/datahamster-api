import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Source } from '../../source/entities/source.entity';
import { Event } from '../../event/entities/event.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginatedResults } from '../../shared/pagination/pagination.gql';

@Entity()
@ObjectType()
export class Action {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'Action ID' })
  id: string;

  @Column({ nullable: false })
  @Field(() => String, { description: 'Action name' })
  name: string;

  @Column({ nullable: false })
  @Generated('uuid')
  @Field(() => String, { description: 'Public action ID' })
  publicId: string;

  @ManyToOne(() => User, (user: User) => user.actions, {
    nullable: false,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  user: User;

  @ManyToOne(() => Source, (source: Source) => source.actions, {
    nullable: false,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  source: Source;

  @OneToMany(() => Event, (event: Event) => event.action, {
    eager: true,
  })
  @Field(() => [Event], { nullable: true, description: 'Action events' })
  events: Event[];

  @CreateDateColumn({ type: 'timestamp without time zone' })
  @Field(() => Date, { description: 'Action creation date' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  @Field(() => Date, { description: 'Action update date' })
  updatedAt: Date;
}

@ObjectType()
export class PaginatedActions extends PaginatedResults(Action) {}
