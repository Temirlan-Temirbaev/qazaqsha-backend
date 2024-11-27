import {Module} from "@nestjs/common";
import {QuestionUseCase} from "./question.use-case";
import {DataServiceModule} from "../../services/data-service";
import {FileServiceModule} from "../../services/file-service";

@Module({
  imports : [DataServiceModule, FileServiceModule],
  providers: [QuestionUseCase],
  exports: [QuestionUseCase],
})
export class QuestionUseCasesModule {}