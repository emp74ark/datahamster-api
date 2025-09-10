import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Source {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150, nullable: false })
  title: string;

  @Column({ length: 5000 })
  description?: string;

  @Column({
    type: 'simple-array',
  })
  actions: string[];

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
