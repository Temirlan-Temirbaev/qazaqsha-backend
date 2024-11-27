import { User } from './user.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Assignment } from './assignment.model';

@Entity()
export class Reply {
  @PrimaryGeneratedColumn('uuid')
  reply_id: string;
  // @ManyToOne(() => Assignment, (assignment) => assignment.replies)
  // assignment: Assignment;
  @Column({ type: 'json' })
  student: User;
  @Column({ type: 'text', array: true })
  answers: string[];
  @Column()
  score: number;
  @CreateDateColumn()
  created_at: Date;
}
