import {Injectable} from "@nestjs/common";
import {IDataService} from "../../core/abstracts";
import {Course} from "../../core/entities";
import {IFileService} from "../../core/abstracts/file-service.abstract";
import {FileTypesEnum} from "../../shared/enums/FileTypes.enum";

@Injectable()
export class TeacherUseCase {
  constructor(private dataService: IDataService, private fileService: IFileService) {
  }

  async createCourse(
    name: string, level: "A1" | "A2" | "B1" | "B2"): Promise<Course> {
    const course = this.dataService.courses.create({
      name,
      level
    },);

    const savedCourse = await this.dataService.courses.save(course);
    return savedCourse;
  }

  async createLesson(courseId: string, title: string, text?: string, file?: Express.Multer.File) {
    const course = await this.dataService.courses.get({where: {course_id: courseId}});
    if (!course) {
      throw new Error('Course not found');
    }

    const lesson = this.dataService.lessons.create({course, title, text});
    if (file) {
      const format = file.mimetype.split('/')[0];
      this.fileService.validateType(file, format);
      const contentUrl = await this.fileService.saveFile(file.buffer, file.originalname);
      lesson[format] = contentUrl;
    }
    return await this.dataService.lessons.save(lesson);
  }

  async getCourses() {
    return await this.dataService.courses.getMany({
      relations:
        [
          "students",
          "courseProgress",
        ]
    })
  }
}