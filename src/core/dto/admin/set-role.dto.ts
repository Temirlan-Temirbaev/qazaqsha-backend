export class SetRoleDto {
  user_id: string;
  role: "teacher" | "user" | "moderator"
}