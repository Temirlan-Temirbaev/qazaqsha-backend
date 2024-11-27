import {Entity, Column, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';
import { Course } from './course.model';
import { CourseProgress } from './courseProgress.model';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  user_id: string;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column({
    type: 'enum',
    enum: ['user', 'teacher', 'admin', 'moderator'],
    default: 'user',
  })
  role: 'user' | 'teacher' | 'admin' | 'moderator';
  @Column()
  fullName: string;
  @Column({
    type: 'enum',
    enum: ['male', 'female'],
    default:'male',
  })
  sex: 'male' | 'female';
  @Column()
  age: number;
  @Column()
  nation: string;
  @Column()
  mail: string;
  @Column()
  phone: string;
  @ManyToMany(() => Course, (course) => course.students)
  courses: Course[];
  @OneToMany(() => CourseProgress, (courseProgress) => courseProgress.user)
  courseProgress: CourseProgress[];
}
