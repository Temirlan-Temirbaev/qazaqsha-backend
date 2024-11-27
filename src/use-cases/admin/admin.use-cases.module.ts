import {Module} from "@nestjs/common";
import {DataServiceModule} from "../../services/data-service";
import {AdminUseCase} from "./admin.use-case";
import {UserUseCasesModule} from "../user/user.use-cases.module";
import {FileServiceModule} from "../../services/file-service";

@Module({
  imports: [DataServiceModule, UserUseCasesModule, FileServiceModule],
  providers: [AdminUseCase],
  exports: [AdminUseCase],
})
export class AdminUseCasesModule {
}