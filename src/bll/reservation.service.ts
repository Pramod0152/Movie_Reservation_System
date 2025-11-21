import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from './base.service';
import { ReservationDataService } from '../dal/reservation.data.service';
import { SlotDataService } from '../dal/slot.data.service';
import { SeatDataService } from '../dal/seat.data.service';
import { MapperService } from '../dal/profile';
import { Reservation } from '../dal/entities/reservations.entity';
import { ReadReservationDto } from '../dto/reservation/read-reservation.dto';
import { CreateReservationDto } from '../dto/reservation/create-reservation.dto';
import { Seat } from '../dal/entities/seats.entity';
import { ReadSeatDto } from '../dto/seat/read-seat.dto';
import { MovieDataService } from '../dal/movie.data.service';
import { ScreenDataService } from '../dal/screen.data.service';
import { TheaterDataService } from '../dal/theater.data.service';
import { SlotAvailabilityDto } from '../dto/slot/slot-availability.dto';
import { MovieShowtimeDto } from '../dto/movie/movie-showtime.dto';
import { TheaterMoviesDto } from '../dto/theater/theater-movies.dto';

@Injectable()
export class ReservationService extends BaseService {
  constructor(
    private readonly reservationDataService: ReservationDataService,
    private readonly slotDataService: SlotDataService,
    private readonly seatDataService: SeatDataService,
    private readonly movieDataService: MovieDataService,
    private readonly screenDataService: ScreenDataService,
    private readonly theaterDataService: TheaterDataService,
    private readonly mapper: MapperService,
  ) {
    super();
  }

  async createReservation(userId: number, payload: CreateReservationDto) {
    if (!payload.slot_id) {
      throw new BadRequestException('slot_id is required');
    }

    if (!payload.seat_ids || payload.seat_ids.length === 0) {
      throw new BadRequestException('At least one seat is required');
    }

    const uniqueSeatIds = Array.from(new Set(payload.seat_ids));
    if (uniqueSeatIds.length !== payload.seat_ids.length) {
      throw new BadRequestException('Duplicate seat selections detected');
    }

    const slot = await this.slotDataService.findById(payload.slot_id);
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    if (new Date(slot.start_time) <= new Date()) {
      throw new BadRequestException('Cannot book seats after show has started');
    }

    const seats = await this.seatDataService.findByIdsAndScreen(uniqueSeatIds, slot.screen_id);
    if (seats.length !== uniqueSeatIds.length) {
      throw new BadRequestException('One or more seats are invalid for the selected screen');
    }

    const reservations = await this.reservationDataService.runInTransaction(async (transaction) => {
      const existing = await this.reservationDataService.findExistingReservations(
        payload.slot_id,
        uniqueSeatIds,
        transaction,
      );

      if (existing.length > 0) {
        throw new ConflictException('One or more seats are already reserved');
      }

      const now = new Date();
      const records = uniqueSeatIds.map((seatId) => ({
        user_id: userId,
        slot_id: payload.slot_id,
        seat_id: seatId,
        reserved_at: now,
      }));

      return this.reservationDataService.createReservations(records, transaction);
    });

    return this.mapper.mapArray(reservations, Reservation, ReadReservationDto);
  }

  async getReservationsForUser(userId: number) {
    const reservations = await this.reservationDataService.findByUser(userId);
    return this.mapper.mapArray(reservations, Reservation, ReadReservationDto);
  }

  async getReservationDetail(userId: number, reservationId: number) {
    const reservation = await this.reservationDataService.findById(reservationId);
    if (!reservation || reservation.user_id !== userId) {
      throw new NotFoundException('Reservation not found');
    }
    return this.mapper.map(reservation, Reservation, ReadReservationDto);
  }

  async cancelReservation(userId: number, reservationId: number) {
    const reservation = await this.reservationDataService.findById(reservationId);
    if (!reservation || reservation.user_id !== userId) {
      throw new NotFoundException('Reservation not found');
    }

    const slot = await this.slotDataService.findById(reservation.slot_id);
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    if (new Date(slot.start_time) <= new Date()) {
      throw new BadRequestException('Cannot cancel reservation after show has started');
    }

    await this.reservationDataService.deleteReservation(reservation.id);
    return this.mapper.map(reservation, Reservation, ReadReservationDto);
  }

  async getSlotAvailability(slotId: number): Promise<SlotAvailabilityDto> {
    const slot = await this.slotDataService.findById(slotId);
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    const seats = await this.seatDataService.findAllByScreen(slot.screen_id);
    if (seats.length === 0) {
      return {
        available: [],
        reserved: [],
      };
    }

    const reservations = await this.reservationDataService.findBySlot(slotId);
    const reservedSeatIds = new Set(reservations.map((item) => item.seat_id));

    const availableSeats = seats.filter((seat) => !reservedSeatIds.has(seat.id));
    const reservedSeats = seats.filter((seat) => reservedSeatIds.has(seat.id));

    return {
      available: this.mapper.mapArray(availableSeats, Seat, ReadSeatDto),
      reserved: this.mapper.mapArray(reservedSeats, Seat, ReadSeatDto),
    };
  }

  async getMovieShowtimes(movieId: number): Promise<MovieShowtimeDto[]> {
    const slots = await this.slotDataService.findAllByMovieId(movieId);
    if (!slots.length) {
      return [];
    }

    const screenIds = Array.from(new Set(slots.map((slot) => slot.screen_id)));
    const screens = await this.screenDataService.findByIds(screenIds);
    const screenMap = new Map(screens.map((screen) => [screen.id, screen]));

    const theaterIds = Array.from(new Set(screens.map((screen) => screen.theater_id)));
    const theaters = await this.theaterDataService.findByIds(theaterIds);
    const theaterMap = new Map(theaters.map((theater) => [theater.id, theater]));

    const responseMap = new Map<number, MovieShowtimeDto>();

    for (const slot of slots) {
      const screen = screenMap.get(slot.screen_id);
      if (!screen) {
        continue;
      }
      const theater = theaterMap.get(screen.theater_id);
      if (!theater) {
        continue;
      }

      if (!responseMap.has(theater.id)) {
        responseMap.set(theater.id, {
          theater_id: theater.id,
          theater_name: theater.name,
          theater_location: theater.location,
          slots: [],
        });
      }

      const entry = responseMap.get(theater.id);
      entry?.slots.push({
        slot_id: slot.id,
        screen_id: screen.id,
        screen_name: screen.name,
        start_time: slot.start_time,
        end_time: slot.end_time,
      });
    }

    return Array.from(responseMap.values());
  }

  async getTheaterMovies(theaterId: number): Promise<TheaterMoviesDto[]> {
    const screens = await this.screenDataService.findAllByTheater(theaterId);
    if (!screens.length) {
      return [];
    }

    const screenIds = screens.map((screen) => screen.id);
    const slots = await this.slotDataService.findAllByScreenIds(screenIds);
    if (!slots.length) {
      return [];
    }

    const movieIds = Array.from(new Set(slots.map((slot) => slot.movie_id)));
    const movies = await this.movieDataService.findByIds(movieIds);
    const movieMap = new Map(movies.map((movie) => [movie.id, movie]));

    const screenMap = new Map(screens.map((screen) => [screen.id, screen]));
    const responseMap = new Map<number, TheaterMoviesDto>();

    for (const slot of slots) {
      const movie = movieMap.get(slot.movie_id);
      const screen = screenMap.get(slot.screen_id);
      if (!movie || !screen) {
        continue;
      }

      if (!responseMap.has(movie.id)) {
        responseMap.set(movie.id, {
          movie_id: movie.id,
          title: movie.title,
          slots: [],
        });
      }

      const entry = responseMap.get(movie.id);
      entry?.slots.push({
        slot_id: slot.id,
        screen_id: screen.id,
        screen_name: screen.name,
        start_time: slot.start_time,
        end_time: slot.end_time,
      });
    }

    return Array.from(responseMap.values());
  }
}
