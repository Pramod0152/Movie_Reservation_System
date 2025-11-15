import { Injectable } from '@nestjs/common';
import { BaseService } from './base.service';
import { UserDataService } from '../dal/user.data.service';
import { MapperService } from '../dal/profile';
import { User } from '../dal/entities/user.entity';
import { ReadUserDto } from '../dto/user/read-user.dto';

@Injectable()
export class UserService extends BaseService {
  constructor(
    private readonly userDataService: UserDataService,
    private readonly mapper: MapperService,
  ) {
    super();
  }

  async getUsers() {
    const users = await this.userDataService.getUsers();
    return this.mapper.mapArray(users, User, ReadUserDto);
  }

  async getUserProfile(userId: number) {
    const user = await this.userDataService.getUserProfile(userId);
    return this.mapper.map(user, User, ReadUserDto);
  }
}
