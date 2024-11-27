import {Module} from "@nestjs/common";
import {DataServiceModule} from "../../services/data-service";
import {UserUseCase} from "./user.use-case";
import {UserFactory} from "./user.factory";
import {JwtModule} from "@nestjs/jwt";
import {AccessTokenStrategy} from "./strategies/accessToken.strategy";

@Module({
  imports: [DataServiceModule, JwtModule.register({}),],
  providers: [UserUseCase, UserFactory, AccessTokenStrategy],
  exports: [UserUseCase]
})
export class UserUseCasesModule {
}