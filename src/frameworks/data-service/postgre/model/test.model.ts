import {Column, Entity, ManyToOne, OneToMany} from 'typeorm';
import { Assignment } from './assignment.model';
import { Course } from './course.model';
import {Question} from "./question.model";

@Entity()
export class Test extends Assignment {
  @ManyToOne(() => Course, (course) => course.tests)
  course: Course;
  @OneToMany(() => Question, question => question.test, {cascade : true})
  questions: Question[];
  @Column({default: false})
  is_final : boolean

}
