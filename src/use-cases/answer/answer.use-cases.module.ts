import {Module} from "@nestjs/common";
import {AnswerUseCase} from "./answer.use-case";
import {DataServiceModule} from "../../services/data-service";
import {FileServiceModule} from "../../services/file-service";

@Module({
  imports : [DataServiceModule, FileServiceModule],
  providers: [AnswerUseCase],
  exports: [AnswerUseCase],
})
export class AnswerUseCasesModule {}