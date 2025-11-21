import { Global, Module } from '@nestjs/common';
import { UserDataService } from './user.data.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { MapperService } from './profile';
import { Theater } from './entities/theaters.entity';
import { TheaterDataService } from './theater.data.service';
import { Screen } from './entities/screens.entity';
import { ScreenDataService } from './screen.data.service';
import { Movie } from './entities/movie.entity';
import { MovieDataService } from './movie.data.service';
import { Slot } from './entities/slots.entity';
import { SlotDataService } from './slot.data.service';
import { Seat } from './entities/seats.entity';
import { SeatDataService } from './seat.data.service';
import { Reservation } from './entities/reservations.entity';
import { ReservationDataService } from './reservation.data.service';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([User, Theater, Screen, Movie, Slot, Seat, Reservation])],
  providers: [
    UserDataService,
    TheaterDataService,
    ScreenDataService,
    MovieDataService,
    SlotDataService,
    SeatDataService,
    ReservationDataService,
    MapperService,
  ],
  exports: [
    UserDataService,
    TheaterDataService,
    ScreenDataService,
    MovieDataService,
    SlotDataService,
    SeatDataService,
    ReservationDataService,
    MapperService,
  ],
})
export class DalModule {}
