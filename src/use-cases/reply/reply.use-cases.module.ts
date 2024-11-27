import {Module} from "@nestjs/common";
import {DataServiceModule} from "../../services/data-service";
import {ReplyUseCase} from "./reply.use-case";

@Module({
  imports: [DataServiceModule],
  providers: [ReplyUseCase],
  exports: [ReplyUseCase]
})
export class ReplyUseCasesModule {}