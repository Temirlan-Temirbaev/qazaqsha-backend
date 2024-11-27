import {Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors} from "@nestjs/common";
import {AnswerUseCase} from "../use-cases/answer/answer.use-case";
import {RoleGuard} from "../use-cases/user/guards/role.guard";
import {Roles} from "../use-cases/user/decorators/role";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller("answer")
export class AnswerController {
  constructor(private answerUseCase: AnswerUseCase) {
  }

  @Post()
  @UseGuards(RoleGuard)
  @Roles("teacher", "moderator")
  @UseInterceptors(FileInterceptor("file"))
  async createAnswer(@Body() body : {question_id: string; isCorrect: boolean, text?: string}, @UploadedFile() file?: Express.Multer.File){
    console.log(body)
    return await this.answerUseCase.createAnswer(body.question_id, body?.text ? body.text : file, body.isCorrect )
  }
}