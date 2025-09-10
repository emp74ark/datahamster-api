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

@Entity()
export class Source {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150, nullable: false })
  title: string;

  @Column({ length: 5000 })
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
  actions: Action[];

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
