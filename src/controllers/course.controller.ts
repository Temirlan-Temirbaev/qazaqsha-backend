import {Controller, Get, Param} from "@nestjs/common";
import {IDataService} from "../core/abstracts";
import {Public} from "../use-cases/user/decorators/public";
import {getUserId} from "../use-cases/user/decorators/getUserId";

@Controller("course")
export class CourseController {
  constructor(private dataService: IDataService) {

  }

  @Get("all")
  @Public()
  async getAllCourses() {
    const courses = await this.dataService.courses.getMany({relations : ["lessons", "tests", "students", "courseProgress"]})
    return courses.map(course => ({...course, lessons : course.lessons.length, tests: course.tests.length}))
  }

  @Get("progress/:id")
  async getCourseProgress(@Param('id') id: string, @getUserId() user_id : string) {
    const progress = await this.dataService.course_progress.get({where: {course: {course_id : id}, user: {user_id}}, relations : ["course", "course.tests"]})
    if (!progress) return {}
    return ({
      ...progress,
      course : {...progress.course, tests : progress.course.tests.length}
    })
  }

  @Get("progress")
  async getCourseProgresses(@getUserId() user_id : string) {
    const progresses = await this.dataService.course_progress.getMany({where: {user: {user_id}}, relations : ["course", "course.tests"]})
    if (!progresses) return []
    return progresses.map(p => ({
      ...p,
      course : {...p.course, tests: p?.course?.tests?.length || 0}
    }))
  }
}