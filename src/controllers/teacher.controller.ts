import {Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors} from "@nestjs/common";
import {TeacherUseCase} from "../use-cases/teacher/teacher.use-case";
import {RoleGuard} from "../use-cases/user/guards/role.guard";
import {Roles} from "../use-cases/user/decorators/role";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller("teacher")
export class TeacherController {
  constructor(private teacherUseCase: TeacherUseCase) {
  }

  @Post("course")
  @UseGuards(RoleGuard)
  @Roles("teacher", "moderator")
  async createCourse(
    @Body() body: {name: string, level: "A1" | "A2" | "B1" | "B2"},
  ) {
    return await this.teacherUseCase.createCourse(body.name, body.level);
  }


  @Post("lesson")
  @UseGuards(RoleGuard)
  @Roles("teacher", "moderator")
  @UseInterceptors(FileInterceptor("file"))
  async createLesson(@Body() body: { courseId: string, title: string, text: string}, @UploadedFile() file : Express.Multer.File) {
    return await this.teacherUseCase.createLesson(body.courseId, body.title, body.text, file)
  }

  @Get()
  @UseGuards(RoleGuard)
  @Roles("teacher", "moderator")
  async getCourses()
  {
    return this.teacherUseCase.getCourses();
  }
}