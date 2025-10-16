import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Action } from '../../action/entities/action.entity';
import { User } from '../../user/entities/user.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginatedResults } from '../../shared/pagination/pagination.gql';

@Entity()
@ObjectType()
export class Source {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'Source ID' })
  id: string;

  @Column({ length: 150, nullable: false })
  @Field(() => String, { description: 'Source title' })
  title: string;

  @Column({ length: 5000 })
  @Field(() => String, { description: 'Source description' })
  description?: string;

  @ManyToOne(() => User, (user: User) => user.sources, {
    nullable: false,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  user: User;

  @OneToMany(() => Action, (action: Action) => action.source, {
    eager: true,
  })
  @Field(() => [Action], {
    nullable: true,
    description: 'Source actions',
  })
  actions: Action[];

  @CreateDateColumn({ type: 'timestamp without time zone' })
  @Field(() => Date, { description: 'Source creation date' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  @Field(() => Date, { description: 'Source update date' })
  updatedAt: Date;
}

@ObjectType()
export class PaginatedSources extends PaginatedResults(Source) {}

@ObjectType()
export class DeleteSourceResponse {
  @Field(() => String, { description: 'Message' })
  message: string;
}
