import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import {UserUseCase} from "../use-cases/user/user.use-case";
import {Public} from "../use-cases/user/decorators/public";
import {getUserId} from "../use-cases/user/decorators/getUserId";
import {CreateUserDto} from "../core/dto/user";


@Controller("user")
export class UserController {
  constructor(private userUseCase: UserUseCase) {
  }

  @Get("/all")
  @Public()
  async getUsers() {
    return await this.userUseCase.getUsers();
  }

  @Get("/id/:id")
  @Public()
  async getUserById(@Param("id") id: string) {
    return await this.userUseCase.getUserById(id);
  }

  @Public()
  @Post("register")
  async register(@Body() dto: CreateUserDto) {
    return await this.userUseCase.register(dto)
  }

  @Public()
  @Post("login")
  async login(@Body() dto: CreateUserDto) {
    return await this.userUseCase.login(dto)
  }

  @Get("check-login")
  async checkLogin(@getUserId() user_id : string) {
    return await this.userUseCase.checkLogin(user_id)
  }

}