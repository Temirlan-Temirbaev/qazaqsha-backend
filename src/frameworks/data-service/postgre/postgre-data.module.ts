import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgreDataService } from './postgre-data.service';
import { IDataService } from 'src/core/abstracts';
import {
  User,
  Lesson,
  Answer,
  Question,
  Course,
  Quiz,
  Test,
  Reply, CourseProgress, QuestionVersion, StartTest,
} from './model';
import { Assignment } from './model/assignment.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Quiz,
      Lesson,
      Answer,
      Question,
      Course,
      Test,
      Reply,
      Assignment,
      CourseProgress,
      QuestionVersion,
      StartTest
    ]),
    TypeOrmModule.forRoot({
      entities: [
        User,
        Quiz,
        Lesson,
        Answer,
        Question,
        Course,
        Test,
        Reply,
        Assignment,
        CourseProgress,
        QuestionVersion,
        StartTest
      ],
      type: 'postgres',
      synchronize: true,
      url: process.env.DATABASE_URL,
    }),
  ],
  providers: [
    {
      provide: IDataService,
      useClass: PostgreDataService,
    },
  ],
  exports: [IDataService],
})
export class PostgreDataModule {}
