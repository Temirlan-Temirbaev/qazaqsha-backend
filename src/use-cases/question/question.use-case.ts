import { IDataService } from '../../core/abstracts';
import { IFileService } from '../../core/abstracts/file-service.abstract';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Success } from '../../shared/types/Success.type';

@Injectable()
export class QuestionUseCase {
  constructor(
    private dataService: IDataService,
    private fileService: IFileService,
  ) {}

  // Получение всех вопросов
  async getQuestions(page = 1) {
    return this.dataService.questions.getAll((page - 1) * 20, 20);
  }

  // Создание вопроса
  async createQuestion(
    test_id: string,
    content: string | Express.Multer.File,
    type: 'default' | 'select' | 'input',
    correct_input?: string,
  ): Promise<Success> {
    try {
      const test = await this.dataService.tests.get({
        where: { assignment_id: test_id },
        relations: ['questions'],
      });
      const startTest = await this.dataService.start_test.get({
        where: { assignment_id: test_id },
        relations: ['questions'],
      });
      if (!test && !startTest) {
        new NotFoundException('Test or startTest not found');
      }
      const question = this.dataService.questions.create({
        type: type ? type : 'default',
        correct_input: correct_input ? correct_input : null,
      });
      if (typeof content === 'string') {
        question.text = content;
      } else {
        const format = content.mimetype.split('/')[0];
        this.fileService.validateType(content, format);
        const contentUrl = await this.fileService.saveFile(
          content.buffer,
          content.originalname,
        );
        question[format] = contentUrl;
      }

      if (test) {
        test.questions = [...test.questions, question];
        question.test = test;
        await this.dataService.tests.save(test);
      }
      if (startTest) {
        startTest.questions = [...startTest.questions, question];
        question.start_test = startTest;
        await this.dataService.start_test.save(startTest);
      }
      await this.dataService.questions.save(question);
      return { success: true };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // Редактирование вопроса с версионностью
  async editQuestion(
    id: string,
    updatedContent: string | Express.Multer.File,
  ): Promise<Success> {
    const question = await this.dataService.questions.get({
      where: { question_id: id },
    });
    if (!question) throw new NotFoundException('Question not found');

    // Сохранение текущей версии вопроса
    const questionVersion = this.dataService.question_versions.create({
      question,
      text: question.text,
      image: question.image,
      audio: question.audio,
      video: question.video,
      is_submitted: question.is_submitted,
    });
    await this.dataService.question_versions.save(questionVersion);

    // Обновление текущего вопроса
    if (typeof updatedContent === 'string') {
      question.text = updatedContent;
      question.image = null;
      question.audio = null;
      question.video = null;
    } else {
      const format = updatedContent.mimetype.split('/')[0];
      this.fileService.validateType(updatedContent, format);
      const fileTypes = ['image', 'audio', 'video'];

      for (const fileType of fileTypes) {
        if (question[fileType]) {
          await this.fileService.deleteFile(question[fileType]);
          question[fileType] = null;
        }
      }

      const contentUrl = await this.fileService.saveFile(
        updatedContent.buffer,
        updatedContent.originalname,
      );
      question[format] = contentUrl;
    }

    await this.dataService.questions.save(question);
    return { success: true };
  }

  // Удаление вопроса
  async deleteQuestion(id: string): Promise<Success> {
    const question = await this.dataService.questions.get({
      where: { question_id: id },
    });
    if (!question) throw new NotFoundException('Question not found');

    const fileTypes = ['image', 'audio', 'video'];
    for (const fileType of fileTypes) {
      if (question[fileType]) {
        await this.fileService.deleteFile(question[fileType]);
      }
    }

    await this.dataService.questions.delete(id);
    return { success: true };
  }

  // Отправка вопроса
  async submitQuestion(id: string): Promise<Success> {
    const question = await this.dataService.questions.get({
      where: { question_id: id },
    });
    if (!question) throw new NotFoundException('Question not found');

    question.is_submitted = true;
    await this.dataService.questions.save(question);
    return { success: true };
  }

  // Получение всех версий конкретного вопроса
  async getQuestionVersions(id: string) {
    const question = await this.dataService.questions.get({
      where: { question_id: id },
      relations: ['versions'],
    });
    if (!question) throw new NotFoundException('Question not found');

    return question.versions;
  }

  async revertQuestionToVersion(
    questionId: string,
    versionId: string,
  ): Promise<Success> {
    const version = await this.dataService.question_versions.get({
      where: { version_id: versionId },
      relations: ['question'],
    });
    if (!version) throw new NotFoundException('Version not found');

    const question = version.question;
    question.text = version.text;
    question.image = version.image;
    question.audio = version.audio;
    question.video = version.video;
    question.is_submitted = version.is_submitted;

    await this.dataService.questions.save(question);
    return { success: true };
  }
}
