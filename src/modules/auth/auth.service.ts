import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { UserDataService } from '../../dal/user.data.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthVariables } from '../../app/lib/enum';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../../dto/user/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userDataService: UserDataService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(item: LoginDto) {
    const user = await this.userDataService.getUserByEmail(item.email);
    if (!user) {
      throw new Error('User Not Found');
    }
    const isPasswordMatching = await bcrypt.compare(item.password, user.password);
    if (!isPasswordMatching) {
      throw new Error('Invalid Credentials');
    }
    const payload = { sub: user.id, username: user.username, email: user.email };
    const tokens = await this.getJwtTokens(payload);
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user,
      message: 'User logged in successfully',
    };
  }

  async registerUser(item: CreateUserDto) {
    if (!item.username) {
      throw new Error('Username is required');
    }
    if (!item.email) {
      throw new Error('Email is required');
    }
    if (!item.password) {
      throw new Error('Password is required');
    }
    const salt = AuthVariables.SaltOrRounds;
    const hashedPassword = await bcrypt.hash(item.password, salt);
    item.password = hashedPassword;
    const user = await this.userDataService.createUser(item);

    const payload = { sub: user.id, username: user.username, email: user.email };
    const tokens = await this.getJwtTokens(payload);
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user,
      message: 'User registered successfully',
    };
  }

  /**
   * Create and return refresh token.
   * @param payload
   * @returns
   */
  async getJwtTokens(payload: any): Promise<any> {
    console.log(
      `JWT ACCESS TOKEN SECRET: ${this.configService.get<string>('AUTH_JWT_ACCESS_TOKEN_SECRET_KEY')}`,
    );
    console.log(
      `JWT REFRESH TOKEN SECRET: ${this.configService.get<string>('AUTH_JWT_REFRESH_TOKEN_SECRET_KEY')}`,
    );
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('AUTH_JWT_ACCESS_TOKEN_SECRET_KEY'),
        expiresIn: this.configService.get<string | undefined | any>(
          'AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN',
        ),
      }),

      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('AUTH_JWT_REFRESH_TOKEN_SECRET_KEY'),
        expiresIn: this.configService.get<string | undefined | any>(
          'AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN',
        ),
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async getMyProfile(id: number) {
    return await this.userDataService.getUserById(id);
  }
}
