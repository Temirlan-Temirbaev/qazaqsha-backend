import {Injectable} from "@nestjs/common";
import {CreateUserDto} from "../../core/dto/user";
import {User} from "../../core/entities";

@Injectable()
export class UserFactory {
  createUser(body: CreateUserDto): User {
    const user = new User();
    user.username = body.username;
    user.mail = body.mail;
    user.age = body.age;
    user.fullName = body.fullName;
    user.nation = body.nation;
    user.phone = body.phone;
    user.password = body.password;
    user.sex = body.sex;
    return user;
  }
}