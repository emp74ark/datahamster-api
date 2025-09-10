import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Action } from '../../action/entities/action.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  localTime: Date;

  @Column()
  ip: string;

  @Column({ type: 'simple-json' })
  data?: Record<string, string | number | boolean>;

  @ManyToOne(() => User, (user: User) => user.events, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Action, (action: Action) => action.events, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  action: Action;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;
}
