import { PrimaryGeneratedColumn, Column, OneToMany, Entity } from 'typeorm';
import { Question } from './question.model';
import { Reply } from './reply.model';
@Entity()
export abstract class Assignment {
  @PrimaryGeneratedColumn('uuid')
  assignment_id: string;

  @Column()
  title: string;

  // @OneToMany(() => Reply, (reply) => reply.assignment)
  @Column("json")
  replies: Reply[] | [];


  @Column({default: 100})
  points: number;
}
