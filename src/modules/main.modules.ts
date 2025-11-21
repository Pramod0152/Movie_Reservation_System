import { Global, Module } from '@nestjs/common';
import { DalModule } from '../dal/dal.modules';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { UserModule } from './user/user.modules';
import { TheaterModule } from './theater/theater.modules';
import { ScreenModule } from './screen/screen.modules';
import { MovieModule } from './movie/movie.modules';
import { SlotModule } from './slot/slot.modules';
import { SeatModule } from './seat/seat.modules';
import { ReservationModule } from './reservation/reservation.modules';
import { RolesGuard } from './auth/guard/roles.guard';

@Global()
@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('AUTH_JWT_ACCESS_TOKEN_SECRET_KEY');
        const expiresIn = config.get<string>('AUTH_JWT_EXPIRES_IN');
        return {
          secret,
          signOptions: { expiresIn: expiresIn as any },
        };
      },
    }),
    DalModule,
    UserModule,
    TheaterModule,
    ScreenModule,
    MovieModule,
    SlotModule,
    SeatModule,
    ReservationModule,
  ],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [AuthService, RolesGuard],
  controllers: [AuthController],
})
export class MainModules {}
