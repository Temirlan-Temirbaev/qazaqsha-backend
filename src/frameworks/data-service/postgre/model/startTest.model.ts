import {Entity, ManyToOne, OneToMany} from 'typeorm';
import { Assignment } from './assignment.model';
import { Course } from './course.model';
import {Question} from "./question.model";

@Entity()
export class StartTest extends Assignment {
  @OneToMany(() => Question, question => question.start_test, {cascade : true})
  questions: Question[];
}
