import { TheaterDataService } from './../../dal/theater.data.service';
import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { UserDataService } from '../../dal/user.data.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthVariables } from '../../app/lib/enum';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../../dto/user/login.dto';
import { User } from '../../dal/entities/user.entity';
import { ReadUserDto } from '../../dto/user/read-user.dto';
import { MapperService } from '../../dal/profile';
import { CreateTheaterDto } from '../../dto/theater/create-theater.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userDataService: UserDataService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mapper: MapperService,
    private readonly theaterDataService: TheaterDataService,
  ) {}

  async loginTheater(item: LoginDto) {
    const theater = await this.theaterDataService.findByEmail(item.email);
    if (!theater) {
      throw new Error('Theater Not Found');
    }

    const isPasswordMatching = await bcrypt.compare(item.password, theater.password);
    if (!isPasswordMatching) {
      throw new Error('Invalid Credentials');
    }

    const payload = {
      sub: theater.id,
      name: theater.name,
      email: theater.email,
      type: 'theater' as const,
    };
    const tokens = await this.getJwtTokens(payload);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      theater,
      message: 'Theater logged in successfully',
    };
  }
  async login(item: LoginDto) {
    const user = await this.userDataService.getUserByEmail(item.email);
    if (!user) {
      throw new Error('User Not Found');
    }

    const isPasswordMatching = await bcrypt.compare(item.password, user.password);
    if (!isPasswordMatching) {
      throw new Error('Invalid Credentials');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      type: 'user' as const,
    };
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

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      type: 'user' as const,
    };
    const tokens = await this.getJwtTokens(payload);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user,
      message: 'User registered successfully',
    };
  }

  async registerTheater(item: CreateTheaterDto) {
    if (!item.email) {
      throw new Error('Email is required');
    }
    if (!item.password) {
      throw new Error('Password is required');
    }
    const salt = AuthVariables.SaltOrRounds;
    const hashedPassword = await bcrypt.hash(item.password, salt);
    item.password = hashedPassword;

    const theater = await this.theaterDataService.createTheater(item);

    const payload = {
      sub: theater.id,
      name: theater.name,
      email: theater.email,
      type: 'theater' as const,
    };
    const tokens = await this.getJwtTokens(payload);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      theater,
      message: 'Theater registered successfully',
    };
  }

  /**
   * Create and return refresh token.
   * @param payload
   * @returns
   */
  async getJwtTokens(payload: any): Promise<any> {
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
}
