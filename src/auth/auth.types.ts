import { User } from '../user/entities/user.entity';

export type AuthSession = {
  user: Pick<User, 'id' | 'role'>;
};
