import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { UserDataService } from '../../dal/user.data.service';

@Injectable()
export class AuthService {
    constructor(private readonly userDataService: UserDataService) {}

    async registerUser(item: CreateUserDto) {
        const user = await this.userDataService.createUser(item);
        if(!user) {
            throw new Error('User registration failed');
        }
    }
}
