import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '../schema/user.schema';
import { UserRepository } from './user.repository';
import { MongooseBaseRepository } from '../../common/repository/mongo/mongooseBase.repository';

@Injectable()
export class MongooseUserRepository
  extends MongooseBaseRepository<User>
  implements UserRepository
{
  constructor(
    @InjectModel(User.name)
    userModel: Model<User>,
  ) {
    super(userModel);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.model.findOne({ email }).exec();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.model.findOne({ name: username }).exec();
  }
}
