import {
  Controller,
  Post,
  Body,
  BadRequestException, Get, Param, UseGuards
} from "@nestjs/common";
import {AssignmentUseCase} from "../use-cases/assignment/assignment.use-case";
import {Success} from "../shared/types/Success.type";
import {RoleGuard} from "../use-cases/user/guards/role.guard";
import {Roles} from "../use-cases/user/decorators/role";

@Controller("assignment")
export class AssignmentController {
  constructor(private assignmentUseCase: AssignmentUseCase) {}

  @Get("start-test")
  async getStartTest() {
    return this.assignmentUseCase.getStartTest();
  }

  @Post("test")
  @UseGuards(RoleGuard)
  @Roles("teacher", "moderator")
  async createTest(
    @Body("courseId") courseId: string,
    @Body("title") title: string,
    @Body("points") points: number,
    @Body("isFinal") isFinal: boolean
  ): Promise<Success> {
    if (!courseId || !title || points === undefined) {
      throw new BadRequestException("Course ID, title, and points are required");
    }

    return await this.assignmentUseCase.createTest(courseId, title, points, isFinal);
  }

  @Post("start-test")
  @UseGuards(RoleGuard)
  @Roles("teacher", "moderator")
  async createStartTest(
    @Body("title") title: string,
    @Body("points") points: number
  ): Promise<Success> {
    return await this.assignmentUseCase.createStartTest(title, points);
  }

  @Post("quiz")
  @UseGuards(RoleGuard)
  @Roles("teacher")
  async createQuiz(
    @Body("lessonId") lessonId: string,
    @Body("title") title: string,
    @Body("points") points: number
  ): Promise<Success> {
    if (!lessonId || !title || points === undefined) {
      throw new BadRequestException("Lesson ID, title, and points are required");
    }

    return await this.assignmentUseCase.createQuiz(lessonId, title, points);
  }

  @Get("tests/:courseId")
  async getTestsByCourseId(@Param("courseId") courseId : string){
    return this.assignmentUseCase.getTestsByCourseId(courseId);
  }
}