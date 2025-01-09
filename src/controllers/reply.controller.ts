import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import {ReplyUseCase} from "../use-cases/reply/reply.use-case";
import {getUserId} from "../use-cases/user/decorators/getUserId";

@Controller("reply")
export class ReplyController {
  constructor(private replyUseCase: ReplyUseCase) {
  }

  @Post()
  async createReply(
    @Body("assignmentId") assignmentId: string,
    @getUserId() studentId: string,
    @Body("type") type: "tests" | "quizes" | "start_test",
    @Body("studentAnswers") studentAnswers: { questionId: string; answerId: string }[]) {
    return await this.replyUseCase.createReply(assignmentId, studentId, type, studentAnswers);
  }

  @Get(":id")
  async getReplyById(@Param("id") id: string, @getUserId() user_id : string) {
    return await this.replyUseCase.getReplyById(id, user_id);
  }
}