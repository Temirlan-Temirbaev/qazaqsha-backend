import {
  Column,
  Entity, JoinTable,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course.model';
import { Quiz } from './quiz.model';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  lesson_id: string;

  @ManyToOne(() => Course, (course) => course.lessons)
  course: Course;

  @OneToOne(() => Quiz, (quiz) => quiz.lesson, { nullable: true })
  quiz: Quiz;

  @Column()
  title: string;

  @Column({ nullable: true })
  video: string | null;

  @Column({ nullable: true })
  text: string | null;
}
