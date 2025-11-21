import { Global, Module } from '@nestjs/common';
import { UserService } from '../bll/user.service';
import { TheaterService } from './theater.service';
import { ScreenService } from './screen.service';
import { MovieService } from './movie.service';
import { SlotService } from './slot.service';
import { SeatService } from './seat.service';
import { ReservationService } from './reservation.service';
@Global()
@Module({
  providers: [
    UserService,
    TheaterService,
    ScreenService,
    MovieService,
    SlotService,
    SeatService,
    ReservationService,
  ],
  exports: [
    UserService,
    TheaterService,
    ScreenService,
    MovieService,
    SlotService,
    SeatService,
    ReservationService,
  ],
})
export class ServiceModules {}
