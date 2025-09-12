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

@Entity()
export class Action {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  @Generated('uuid')
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

  @OneToMany(() => Event, (event: Event) => event.action, {})
  events: Event[];

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
