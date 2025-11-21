import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UserDataService } from '../../../dal/user.data.service';
import { TheaterDataService } from '../../../dal/theater.data.service';

interface AuthJwtPayload {
  sub: number;
  type: 'user' | 'theater';
  username?: string;
  name?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userDataService: UserDataService,
    private readonly theaterDataService: TheaterDataService,
  ) {
    const secretKey = configService.get<string>('AUTH_JWT_ACCESS_TOKEN_SECRET_KEY');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
      passReqToCallback: true,
    });
  }

  async validate(_request: any, payload: AuthJwtPayload) {
    if (payload.type === 'user') {
      const user = await this.userDataService.getUserProfile(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return {
        id: user.id,
        type: 'user' as const,
        username: user.username,
      };
    }

    if (payload.type === 'theater') {
      const theater = await this.theaterDataService.findById(payload.sub);
      if (!theater) {
        throw new UnauthorizedException('Theater not found');
      }
      return {
        id: theater.id,
        type: 'theater' as const,
        name: theater.name,
      };
    }

    throw new UnauthorizedException('Invalid token payload');
  }
}
