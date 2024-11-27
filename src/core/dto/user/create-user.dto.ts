export class CreateUserDto {
  readonly username: string;
  readonly password: string;
  readonly fullName: string;
  readonly sex: "male" | "female";
  readonly age: number;
  readonly nation: string;
  readonly mail: string;
  readonly phone: string;
}