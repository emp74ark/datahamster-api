import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JSONValue } from '../../shared/shared.types';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  localTime: Date;

  @Column()
  ip: string;

  @Column({ type: 'simple-json' })
  data: JSONValue;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;
}
