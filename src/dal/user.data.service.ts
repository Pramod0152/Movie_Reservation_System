import { Injectable } from '@nestjs/common';
import { BaseDataService } from './base.data.service';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { CreateUserDto } from '../dto/user/create-user.dto';

@Injectable()
export class UserDataService extends BaseDataService {
  constructor(@InjectModel(User) private readonly model: typeof User) {
    super();
  }

  async createUser(item: CreateUserDto) {
    return await this.model.create({
      username: item.username,
      email: item.email,
      password: item.password,
      tags: item.tags ?? null,
    });
  }

  async getUserByEmail(email: string) {
    return await this.model.findOne({ where: { email: email } });
  }

  async getUserById(id: number) {
    return await this.model.findOne({ where: { id: id } });
  }

  async getAllUsers() {
    return await this.model.findAll();
  }
}
