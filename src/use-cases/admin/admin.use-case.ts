import {Injectable} from "@nestjs/common";
import {IDataService} from "../../core/abstracts";
import {CreateProductDto, SetRoleDto} from "../../core/dto/admin";
import {UserUseCase} from "../user/user.use-case";
import {IFileService} from "../../core/abstracts/file-service.abstract";
import {FileTypesEnum} from "../../shared/enums/FileTypes.enum";

@Injectable()
export class AdminUseCase {
  constructor(private dataService: IDataService, private userUseCase: UserUseCase, private fileService: IFileService) {
  }

  async setRole({user_id, role} : SetRoleDto) {
    const user = await this.userUseCase.getUserById(user_id);
    user.role = role;
    return await this.dataService.users.save(user);
  }
}