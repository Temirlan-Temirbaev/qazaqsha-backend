import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.model';

@Entity()
export class QuestionVersion {
  @PrimaryGeneratedColumn('uuid')
  version_id: string;

  @ManyToOne(() => Question, (question) => question.versions, { onDelete: 'CASCADE' })
  question: Question;

  @Column()
  text: string;

  @Column({ nullable: true })
  image: string | null;

  @Column({ nullable: true })
  audio: string | null;

  @Column({ nullable: true })
  video: string | null;

  @Column()
  is_submitted: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}