import {Module} from "@nestjs/common";
import {DataServiceModule} from "../../services/data-service";
import {FileServiceModule} from "../../services/file-service";
import {TeacherUseCase} from "./teacher.use-case";

@Module({
  imports: [DataServiceModule, FileServiceModule],
  providers: [TeacherUseCase],
  exports: [TeacherUseCase]
})
export class TeacherUseCasesModule {

}