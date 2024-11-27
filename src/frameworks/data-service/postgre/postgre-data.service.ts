import {Injectable, OnApplicationBootstrap} from '@nestjs/common';
import {IDataService} from 'src/core/abstracts';
import {PostgreGenericRepository} from './postgre-generic.repository';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {
  Answer,
  Course,
  User,
  Lesson,
  Question,
  Reply,
  Test,
  Quiz,
  CourseProgress, QuestionVersion, StartTest,
} from './model';

@Injectable()
export class PostgreDataService
  implements IDataService, OnApplicationBootstrap {
  answers: PostgreGenericRepository<Answer>;
  courses: PostgreGenericRepository<Course>;
  users: PostgreGenericRepository<User>;
  lessons: PostgreGenericRepository<Lesson>;
  questions: PostgreGenericRepository<Question>;
  replies: PostgreGenericRepository<Reply>;
  tests: PostgreGenericRepository<Test>;
  quizes: PostgreGenericRepository<Quiz>;
  course_progress: PostgreGenericRepository<CourseProgress>;
  question_versions: PostgreGenericRepository<QuestionVersion>;
  start_test : PostgreGenericRepository<StartTest>

  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(CourseProgress)
    private courseProgressRepository: Repository<CourseProgress>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Reply)
    private replyRepository: Repository<Reply>,
    @InjectRepository(Test)
    private testRepository: Repository<Test>,
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(QuestionVersion)
    private questionVersionRepository: Repository<QuestionVersion>,
    @InjectRepository(StartTest) private startTestRepository: Repository<StartTest>
  ) {
  }

  onApplicationBootstrap() {
    this.answers = new PostgreGenericRepository<Answer>(this.answerRepository);
    this.courses = new PostgreGenericRepository<Course>(this.courseRepository);
    this.course_progress = new PostgreGenericRepository<CourseProgress>(this.courseProgressRepository);
    this.users = new PostgreGenericRepository<User>(this.userRepository);
    this.lessons = new PostgreGenericRepository<Lesson>(this.lessonRepository);
    this.questions = new PostgreGenericRepository<Question>(this.questionRepository);
    this.replies = new PostgreGenericRepository<Reply>(this.replyRepository);
    this.tests = new PostgreGenericRepository<Test>(this.testRepository);
    this.quizes = new PostgreGenericRepository<Quiz>(this.quizRepository);
    this.question_versions = new PostgreGenericRepository<QuestionVersion>(this.questionVersionRepository);
    this.start_test = new PostgreGenericRepository<StartTest>(this.startTestRepository)
  }
}