import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QuestionUseCase } from '../use-cases/question/question.use-case';
import { FileInterceptor } from '@nestjs/platform-express';
import { Success } from '../shared/types/Success.type';
import { RoleGuard } from '../use-cases/user/guards/role.guard';
import { Roles } from '../use-cases/user/decorators/role';

@Controller('question')
export class QuestionController {
  constructor(private questionUseCase: QuestionUseCase) {}

  // Получить все вопросы
  @Get()
  @UseGuards(RoleGuard)
  @Roles('teacher', 'moderator')
  async getQuestions(@Req() req: { query: { page: number } }) {
    return this.questionUseCase.getQuestions(req.query.page);
  }

  // Создать новый вопрос
  @Post()
  @UseGuards(RoleGuard)
  @Roles('teacher', 'moderator')
  @UseInterceptors(FileInterceptor('file'))
  async createQuestion(
    @Body('test_id') test_id: string,
    @Body('content') content?: string,
    @Body('type') type?: 'default' | 'select' | 'input',
    @UploadedFile() file?: Express.Multer.File,
    @Body('correct_input') correct_input?: string,
  ): Promise<Success> {
    const questionContent = content || file;

    return await this.questionUseCase.createQuestion(
      test_id,
      questionContent,
      type,
      correct_input,
    );
  }

  // Редактировать вопрос (с созданием версии)
  @Put('edit/:id')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(RoleGuard)
  @Roles('moderator', 'teacher')
  async editQuestion(
    @Param('id') id: string,
    @Body('content') content?: string,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Success> {
    const questionContent = content || file;

    return await this.questionUseCase.editQuestion(id, questionContent);
  }

  // Удалить вопрос
  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles('moderator', 'teacher')
  async deleteQuestion(@Param('id') id: string): Promise<Success> {
    return await this.questionUseCase.deleteQuestion(id);
  }

  // Отправить вопрос
  @Put('submit/:id')
  @UseGuards(RoleGuard)
  @Roles('moderator')
  async submitQuestion(@Param('id') id: string): Promise<Success> {
    return this.questionUseCase.submitQuestion(id);
  }

  // Получить все версии конкретного вопроса
  @Get('versions/:id')
  @UseGuards(RoleGuard)
  @Roles('moderator', 'teacher')
  async getQuestionVersions(@Param('id') id: string) {
    return await this.questionUseCase.getQuestionVersions(id);
  }

  // Откатить вопрос к определенной версии
  @Put('revert/:id/:versionId')
  @UseGuards(RoleGuard)
  @Roles('moderator', 'teacher')
  async revertQuestionToVersion(
    @Param('id') id: string,
    @Param('versionId') versionId: string,
  ): Promise<Success> {
    return await this.questionUseCase.revertQuestionToVersion(id, versionId);
  }
}
