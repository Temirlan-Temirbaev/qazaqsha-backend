import { GenericRepository } from './';
import {
  Answer,
  Course,
  Lesson,
  Question, QuestionVersion,
  Quiz,
  Reply, StartTest, Test,
  User
} from "../entities";
import {CourseProgress} from "../entities/courseProgress";

export abstract class IDataService {
  users: GenericRepository<User>;
  answers: GenericRepository<Answer>;
  courses: GenericRepository<Course>;
  lessons: GenericRepository<Lesson>;
  questions: GenericRepository<Question>;
  question_versions: GenericRepository<QuestionVersion>;
  quizes: GenericRepository<Quiz>;
  replies: GenericRepository<Reply>;
  tests: GenericRepository<Test>;
  start_test: GenericRepository<StartTest>;
  course_progress: GenericRepository<CourseProgress>;
}
