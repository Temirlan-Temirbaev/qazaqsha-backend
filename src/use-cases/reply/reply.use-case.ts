import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {IDataService} from "../../core/abstracts";
import {Success} from "../../shared/types/Success.type";
import {Quiz, Test} from "../../core/entities";

@Injectable()
export class ReplyUseCase {
  constructor(private dataService: IDataService) {
  }

  async createReply(
    assignmentId: string,
    studentId: string,
    type: "tests" | "quizes" | "start_test",
    studentAnswers: { questionId: string; answerId: string }[]
  ) {
    const assignment = await this.dataService[type].get({
      where: {assignment_id: assignmentId},
      relations: ["questions", "questions.answers"],
    });

    if (!assignment) {
      throw new NotFoundException("Assignment not found");
    }

    let score = 0;
    const totalPoints = assignment.points;
    const pointsPerQuestion = totalPoints / assignment.questions.length;
    studentAnswers.forEach(studentAnswer => {
      const {questionId, answerId} = studentAnswer;
      const question = assignment.questions.find(q => q.question_id === questionId);
      const isCorrect = question.answers.some(a => a.answer_id === answerId && a.is_correct);
      if (isCorrect) score += pointsPerQuestion;
    })
    const reply = this.dataService.replies.create({
      student: {user_id: studentId},
      answers: studentAnswers.map((a) => JSON.stringify(a)),
      score: Math.floor(score),
    });

    assignment.replies = [...assignment.replies, reply]

    if (type !== "start_test") {
      const courseProgress = await this.dataService.course_progress.get({where: {user: {user_id: studentId}}})
      courseProgress.points += Math.floor(score);
      await this.dataService.course_progress.save(courseProgress)
    } else {
      let percentage = Math.ceil(totalPoints / 100 * score)
      const student = await this.dataService.users.get({where :{user_id: studentId}, relations : ["courses"]})
      if (student.courses.length !== 0) {
        throw new BadRequestException("вы уже прошли этот тест")
      }
      if (percentage < 30) {
        const course = await this.dataService.courses.get({where: {level : "A1"}, relations : ["students"]})
        course.students = [...course.students, student]
        student.courses = [...student.courses, course]
      }
      if (percentage >= 30 && percentage < 60) {
        const course = await this.dataService.courses.get({where: {level : "A2"}, relations : ["students"]})
        course.students = [...course.students, student]
        student.courses = [...student.courses, course]
      }
      if (percentage >= 60 && percentage < 80) {
        const course = await this.dataService.courses.get({where: {level : "B1"}, relations : ["students"]})
        course.students = [...course.students, student]
        student.courses = [...student.courses, course]
      }
      if (percentage >= 80) {
        const course = await this.dataService.courses.get({where: {level : "B2"}, relations : ["students"]})
        course.students = [...course.students, student]
        student.courses = [...student.courses, course]
      }
      await this.dataService.users.save(student)
    }
    await this.dataService[type].save(assignment as Test & Quiz);
    await this.dataService.replies.save(reply);

    return reply
  }
}