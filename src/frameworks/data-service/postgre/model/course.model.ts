import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany, JoinTable,
} from 'typeorm';
import { User } from './user.model';
import { Lesson } from './lesson.model';
import { Test } from './test.model';
import { CourseProgress } from './courseProgress.model'; // Import CourseProgress

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  course_id: string;
  @Column()
  name: string;
  @Column()
  level: 'A1' | 'A2' | 'B1' | 'B2';

  @ManyToMany(() => User, (user) => user.courses)
  @JoinTable()
  students: User[];
  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Lesson[];
  @OneToMany(() => Test, (test) => test.course)
  tests: Test[];
  @OneToMany(() => CourseProgress, (courseProgress) => courseProgress.course)
  courseProgress: CourseProgress[];
}