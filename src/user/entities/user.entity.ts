import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './user.enums';
import { Source } from '../../source/entities/source.entity';
import { Action } from '../../action/entities/action.entity';
import { Event } from '../../event/entities/event.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false, unique: true })
  username: string;

  @Column({ length: 500, nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    nullable: false,
  })
  role: UserRole;

  @Column({ length: 150, nullable: false })
  email: string;

  @OneToMany(() => Source, (source: Source) => source.user, {
    cascade: false,
  })
  sources: Source[];

  @OneToMany(() => Action, (action: Action) => action.user, {
    cascade: false,
  })
  actions: Action[];

  @OneToMany(() => Event, (event: Event) => event.user, {
    cascade: false,
  })
  events: Event[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ default: new Date() })
  lastLogin: Date;
}
