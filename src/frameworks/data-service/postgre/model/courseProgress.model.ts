import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from './user.model';
import { Course } from './course.model';

@Entity()
export class CourseProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.courseProgress)
  user: User;

  @ManyToOne(() => Course, (course) => course.courseProgress)
  course: Course;

  @Column({ default: 0 })
  points: number;

  @Column({default: false})
  completed: boolean;
}