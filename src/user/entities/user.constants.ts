import { User } from './user.entity';

export const userPublicFields: (keyof User)[] = [
  'id',
  'username',
  'email',
  'role',
];
