import { BaseRepository } from '../../common/repository/base.repository';
import { User } from '../schema/user.schema';

export abstract class UserRepository extends BaseRepository<User> {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByUsername(username: string): Promise<User | null>;
}
