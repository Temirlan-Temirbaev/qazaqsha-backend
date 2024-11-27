import { Injectable, NotFoundException } from "@nestjs/common";
import { IDataService } from "../../core/abstracts";
import { IFileService } from "../../core/abstracts/file-service.abstract";
import {Success} from "../../shared/types/Success.type";

@Injectable()
export class AssignmentUseCase {
  constructor(
    private dataService: IDataService,
    private fileService: IFileService
  ) {}

  async getStartTest(){
    const startTest = await this.dataService.start_test.getMany({relations : ["questions", "questions.answers"]});
    delete startTest[0].replies
    return startTest[0];
  }

  async createStartTest(
    title: string,
    points: number
  ): Promise<Success> {
    const test = this.dataService.start_test.create({
      title,
      points,
      replies: []
    });
    await this.dataService.start_test.save(test);
    return { success: true };
  }

  async createTest(
    courseId: string,
    title: string,
    points: number
  ): Promise<Success> {
    const course = await this.dataService.courses.get({ where: { course_id: courseId }, relations: ["tests"] });
    if (!course) {
      throw new NotFoundException("Course not found");
    }
    const test = this.dataService.tests.create({
      title,
      course,
      points,
      replies: []
    });
    course.tests = [...course.tests, test];
    await this.dataService.courses.save(course);
    await this.dataService.tests.save(test);
    return { success: true };
  }

  async createQuiz(
    lessonId: string,
    title: string,
    points: number
  ): Promise<Success> {
    const lesson = await this.dataService.lessons.get({ where: { lesson_id: lessonId }, relations: ["quiz"] });
    if (!lesson) {
      throw new NotFoundException("Lesson not found");
    }

    const quiz = this.dataService.quizes.create({
      title,
      lesson,
      points,
      questions: [],
      replies: []
    });

    await this.dataService.quizes.save(quiz);
    return { success: true };
  }

  async getTestsByCourseId(courseId: string) {
    const tests = await this.dataService.tests.getMany({where: {course: {course_id: courseId}}, relations: ["questions", "questions.answers"]});
    return tests;
  }
}