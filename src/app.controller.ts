import { Controller, Get, Param } from '@nestjs/common';
import { IDataService } from './core/abstracts';
import { getUserId } from './use-cases/user/decorators/getUserId';

@Controller()
export class AppController {
  constructor(private dataService: IDataService) {}

  @Get('myCourses')
  async getMyCourses(@getUserId() user_id: string) {
    return await this.dataService.courses.getMany({
      where: { students: { user_id } },
      relations: ['teacher', 'levels', 'courseProgress'],
    });
  }

  @Get('course/:courseId')
  async getCourse(
    @Param('courseId') courseId: string,
    @getUserId() user_id: string,
  ) {
    return this.dataService.courses.get({
      where: { course_id: courseId, students: { user_id } },
      relations: [
        'teacher',
        'levels',
        'courseProgress',
        'courseProgress.user',
        'tests',
        'lessons',
      ],
    });
  }


  @Get('lesson/:lessonId')
  async getLesson(@Param('lessonId') lessonId: string) {
    return this.dataService.lessons.get({
      where: { lesson_id: lessonId },
    });
  }

  @Get('full-test/:testId')
  async getFullTestData(@Param('testId') testId: string) {
    return this.dataService.tests.get({
      where: { assignment_id: testId },
      relations: ['questions', 'questions.answers'],
    });
  }

  @Get('full-quiz/:quizId')
  async getFullQuizData(@Param('quizId') quizId: string) {
    return this.dataService.quizes.get({
      where: {
        assignment_id: quizId,
      },
      relations: ['questions', 'questions.answers'],
    });
  }
}
