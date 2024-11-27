import {Entity, JoinColumn, OneToMany, OneToOne} from 'typeorm';
import { Lesson } from './lesson.model';
import { Assignment } from './assignment.model';
import {Question} from "./question.model";

@Entity()
export class Quiz extends Assignment {
  @OneToOne(() => Lesson, (lesson) => lesson.quiz)
  @JoinColumn()
  lesson: Lesson;

  @OneToMany(() => Question, (question) => question.quiz)
  questions: Question[];
}
