import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IDataService } from '../../core/abstracts';
import { Success } from '../../shared/types/Success.type';
import { Quiz, Test } from '../../core/entities';

@Injectable()
export class ReplyUseCase {
  constructor(private dataService: IDataService) {}

  async createReply(
    assignmentId: string,
    studentId: string,
    type: 'tests' | 'quizes' | 'start_test',
    studentAnswers: { questionId: string; answerId: string }[],
  ) {
    const student = await this.dataService.users.get({
      where: { user_id: studentId },
      relations: ['courses'],
    });
    const assignment = await this.dataService[type].get({
      where: { assignment_id: assignmentId },
      relations: ['questions', 'questions.answers'],
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    let score = 0;
    const totalPoints = assignment.points;
    const pointsPerQuestion = totalPoints / assignment.questions.length;
    studentAnswers.forEach((studentAnswer) => {
      const { questionId, answerId } = studentAnswer;
      const question = assignment.questions.find(
        (q) => q.question_id === questionId,
      );
      let isCorrect;
      if (question.type === 'default') {
        isCorrect = question.answers.some(
          (a) => a.answer_id === answerId && a.is_correct,
        );
      } else if (question.type === 'input' && question.correct_input) {
        isCorrect =
          question?.correct_input.trim().trimEnd().trimStart().toLowerCase() ===
          answerId.trim().trimEnd().trimStart().toLowerCase();
      }
      if (isCorrect) score += pointsPerQuestion;
    });
    const reply = this.dataService.replies.create({
      student: student.user_id,
      answers: studentAnswers.map((a) => JSON.stringify(a)),
      score: Math.floor(score),
      assignment_id: assignmentId,
    });

    assignment.replies = [...assignment.replies, reply];

    if (type !== 'start_test') {
      const test = await this.dataService.tests.get({
        where: { assignment_id: assignmentId },
        relations: ['course'],
      });
      let courseProgress = await this.dataService.course_progress.get({
        where: { user: { user_id: studentId } },
      });
      if (!courseProgress) {
        // @ts-ignore
        courseProgress = this.dataService.course_progress.create({
          user: student,
          course: test.course,
          points: Math.floor(score),
        });
      } else {
        courseProgress.points += Math.floor(score);
      }
      const isExisting = await this.dataService.replies.get({
        where: { assignment_id: assignmentId, student: studentId },
      });
      if (!isExisting)
        await this.dataService.course_progress.save(courseProgress);
      if (test.is_final && (score / totalPoints) * 100 >= 80) {
        const currentLevel = test.course.level;
        const levels = ['A1', 'A2', 'B1', 'B2'];
        const currentIndex = levels.indexOf(currentLevel);

        if (currentIndex !== -1 && currentIndex < levels.length - 1) {
          const nextLevel = levels[currentIndex + 1];
          const nextCourse = await this.dataService.courses.get({
            // @ts-ignore
            where: { level: nextLevel },
            relations: ['students'],
          });

          if (
            nextCourse &&
            !nextCourse.students.some((s) => s.user_id === studentId)
          ) {
            nextCourse.students = [...nextCourse.students, student];
            student.courses = [...student.courses, nextCourse];
            await this.dataService.courses.save(nextCourse);
          }
        }
      }
    } else {
      let percentage = Math.ceil((totalPoints / 100) * score);

      if (student.courses.length !== 0) {
        throw new BadRequestException('Вы уже прошли этот тест');
      }

      let levelToUnlock: string | null = null;

      if (percentage < 30) {
        levelToUnlock = 'A1';
      } else if (percentage >= 30 && percentage < 60) {
        levelToUnlock = 'A2';
      } else if (percentage >= 60 && percentage < 80) {
        levelToUnlock = 'B1';
      } else if (percentage >= 80) {
        levelToUnlock = 'B2';
      }

      if (!levelToUnlock) {
        throw new BadRequestException('Не удалось определить уровень');
      }

      const levels = ['A1', 'A2', 'B1', 'B2'];
      const indexToUnlock = levels.indexOf(levelToUnlock);

      if (indexToUnlock === -1) {
        throw new BadRequestException('Уровень не найден');
      }

      const coursesToUnlock = levels.slice(0, indexToUnlock + 1);

      for (const level of coursesToUnlock) {
        const course = await this.dataService.courses.get({
          // @ts-ignore
          where: { level },
          relations: ['students'],
        });

        if (!course.students.some((s) => s.user_id === studentId)) {
          course.students = [...course.students, student];
          student.courses = [...student.courses, course];
        }
      }

      await this.dataService.users.save(student);
    }
    await this.dataService[type].save(assignment as Test & Quiz);
    await this.dataService.replies.save(reply);

    return reply;
  }

  async getReplyById(id: string, user_id: string) {
    const replies = await this.dataService.replies.getMany({
      where: { reply_id: id, student: user_id },
      relations: ['student'],
    });

    if (!replies) {
      throw new NotFoundException('Reply not found');
    }

    return replies.slice(-1);
  }
}
