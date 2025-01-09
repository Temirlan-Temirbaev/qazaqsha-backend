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
  @Column({nullable: true})
  student: string;
  @Column({ type: 'text', array: true })
  answers: string[];
  @Column()
  score: number;
  @Column({nullable: true})
  assignment_id : string
  @CreateDateColumn()
  created_at: Date;
}
