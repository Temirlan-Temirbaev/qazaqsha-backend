import {Module} from "@nestjs/common";
import {DataServiceModule} from "../../services/data-service";
import {FileServiceModule} from "../../services/file-service";
import {AssignmentUseCase} from "./assignment.use-case";

@Module({
  imports: [DataServiceModule, FileServiceModule],
  providers: [AssignmentUseCase],
  exports: [AssignmentUseCase]
})
export class AssignmentUseCasesModule {}