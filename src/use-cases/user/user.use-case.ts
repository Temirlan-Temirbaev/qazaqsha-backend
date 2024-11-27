import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {IDataService} from "../../core/abstracts";
import {CreateUserDto} from "../../core/dto/user";
import {User} from "../../core/entities";
import {UserFactory} from "./user.factory";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
@Injectable()
export class UserUseCase {
  constructor(private dataService: IDataService, private userFactory: UserFactory, private jwtService: JwtService) {
  }

  private async generateToken(user_id: string, role: string): Promise<string> {
    const [accessToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user_id,
          role
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '1d',
        },
      ),
    ]);
    return accessToken;
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = this.userFactory.createUser(dto);
    user.role ="moderator"
    return await this.dataService.users.save(user);
  }

  async register(dto: CreateUserDto): Promise<string> {
    console.log(dto)
    const candidate = await this.dataService.users.get({
      where: [
        { username: dto.username },
        { mail: dto.mail },
        { phone: dto.phone },
      ],
    });

    if (candidate) {
      throw new BadRequestException('Пользователь с такими данными уже существует');
    }

    const password = await bcrypt.hash(dto.password, 7)
    const user = await this.createUser({...dto, password})
    return await this.generateToken(user.user_id, user.role)
  }

  async login(dto: {username: string, password: string}) {
    const candidate = await this.dataService.users.get({where : {username: dto.username}})
    if (!candidate) {
      throw new BadRequestException("Такого пользователя не сущесвтует")
    }
    const isMatch = await bcrypt.compare(dto.password, candidate.password)
    if (!isMatch) {
      throw new UnauthorizedException("Неверный логин или пароль")
    }

    return await this.generateToken(candidate.user_id, candidate.role)
  }

  async checkLogin(user_id: string) {
    const candidate = await this.dataService.users.get({where: {user_id}, relations : ["courses"]})
    if (!candidate) {
      throw new UnauthorizedException("User is not authorized")
    }
    delete candidate.password
    return candidate
  }

  async getUsers(): Promise<User[]> {
    const users = await this.dataService.users.getAll();
    return users;
  }

  async getUserById(user_id: string): Promise<User> {
    const user = await this.dataService.users.get({where: {user_id}})
    if (!user) {
      throw new NotFoundException("User not found")
    }
    return user;
  }

}