import {Injectable, NotFoundException} from "@nestjs/common";
import {IDataService} from "../../core/abstracts";
import {IFileService} from "../../core/abstracts/file-service.abstract";
import {Success} from "../../shared/types/Success.type";

@Injectable()
export class AnswerUseCase {
  constructor(private dataService: IDataService, private fileService: IFileService) {
  }

  async createAnswer(
    questionId: string,
    content: string | Express.Multer.File,
    isCorrect: boolean
  ): Promise<Success> {
    const question = await this.dataService.questions.get({ where: { question_id: questionId }, relations: ["answers"] });
    if (!question) {
      throw new NotFoundException("Question not found");
    }

    const answer = this.dataService.answers.create({
      is_correct: isCorrect,
      question
    });

    if (typeof content === "string") {
      answer.text = content;
    } else {
      const format = content.mimetype.split("/")[0]
      this.fileService.validateType(content, format);
      const contentUrl = await this.fileService.saveFile(content.buffer, content.originalname)
      answer[format] = contentUrl;
    }
    question.answers = [...question.answers, answer];
    await this.dataService.questions.save(question);
    await this.dataService.answers.save(answer);
    return { success: true };
  }
}