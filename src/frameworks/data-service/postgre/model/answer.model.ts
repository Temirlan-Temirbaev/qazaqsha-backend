import { Question } from './question.model';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  answer_id: string;
  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;
  @Column({ nullable: true })
  text: string | null;
  @Column({ nullable: true })
  image: string | null;
  @Column({ nullable: true })
  audio: string | null;
  @Column()
  is_correct: boolean;
}
