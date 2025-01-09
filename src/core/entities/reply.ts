import { User } from './user';
import { Assignment } from './assignment';

export class Reply {
  reply_id: string;
  student: string;
  assignment_id: string;
  answers: string[];
  score: number;
  created_at: Date;
}
