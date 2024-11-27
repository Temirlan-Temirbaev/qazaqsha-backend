import {Body, Controller, Get, Post, Put, UploadedFile, UseGuards, UseInterceptors} from "@nestjs/common";
import {AdminUseCase} from "../use-cases/admin/admin.use-case";
import {CreateProductDto, SetRoleDto} from "../core/dto/admin";
import {RoleGuard} from "../use-cases/user/guards/role.guard";
import {Roles} from "../use-cases/user/decorators/role";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller("admin")
export class AdminController {
  constructor(private adminUseCase: AdminUseCase) {
  }

  @Put("set-role")
  @UseGuards(RoleGuard)
  @Roles("admin")
  async setRole(@Body() body: SetRoleDto) {
    return await this.adminUseCase.setRole(body);
  }
}