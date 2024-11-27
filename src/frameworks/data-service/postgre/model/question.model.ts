import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { QuestionVersion } from './questionVersion.model';
import {Answer} from "./answer.model";
import {Test} from "./test.model";
import {Quiz} from "./quiz.model";
import {StartTest} from "./startTest.model";

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  question_id: string;

  @ManyToOne(() => StartTest, (startTest) => startTest.questions, { nullable: true })
  start_test: StartTest | null;

  @ManyToOne(() => Test, (test) => test.questions, { nullable: true })
  test: Test | null;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { nullable: true })
  quiz: Quiz | null;

  @Column({ nullable: true })
  text: string | null;

  @Column({ nullable: true })
  image: string | null;

  @Column({ nullable: true })
  audio: string | null;

  @Column({ nullable: true })
  video: string | null;

  @Column({ default: false })
  is_submitted: boolean;

  @OneToMany(() => Answer, (answer) => answer.question, { cascade: true })
  answers: Answer[];

  @OneToMany(() => QuestionVersion, (version) => version.question, { cascade: true })
  versions: QuestionVersion[];
}