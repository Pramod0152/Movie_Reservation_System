import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from './base.service';
import { SeatDataService } from '../dal/seat.data.service';
import { ScreenDataService } from '../dal/screen.data.service';
import { MapperService } from '../dal/profile';
import { Seat } from '../dal/entities/seats.entity';
import { ReadSeatDto } from '../dto/seat/read-seat.dto';
import { CreateSeatLayoutDto } from '../dto/seat/create-seat-layout.dto';
import { UpdateSeatDto } from '../dto/seat/update-seat.dto';

@Injectable()
export class SeatService extends BaseService {
  constructor(
    private readonly seatDataService: SeatDataService,
    private readonly screenDataService: ScreenDataService,
    private readonly mapper: MapperService,
  ) {
    super();
  }

  private async ensureScreenBelongsToTheater(theaterId: number, screenId: number) {
    const screen = await this.screenDataService.findByIdAndTheater(screenId, theaterId);
    if (!screen) {
      throw new NotFoundException('Screen not found');
    }
    return screen;
  }

  private async ensureSeatExists(seatId: number, screenId: number) {
    const seat = await this.seatDataService.findByIdAndScreen(seatId, screenId);
    if (!seat) {
      throw new NotFoundException('Seat not found');
    }
    return seat;
  }

  async createSeatLayout(theaterId: number, screenId: number, payload: CreateSeatLayoutDto) {
    await this.ensureScreenBelongsToTheater(theaterId, screenId);

    if (!payload?.seats || payload.seats.length === 0) {
      throw new BadRequestException('At least one seat is required');
    }

    const uniqueSeatNumbers = new Set(payload.seats.map((item) => item.seat_number));
    if (uniqueSeatNumbers.size !== payload.seats.length) {
      throw new BadRequestException('Duplicate seat numbers provided');
    }

    const created = await this.seatDataService.createSeats(screenId, payload.seats);
    return this.mapper.mapArray(created, Seat, ReadSeatDto);
  }

  async getSeatLayout(theaterId: number, screenId: number) {
    await this.ensureScreenBelongsToTheater(theaterId, screenId);
    const seats = await this.seatDataService.findAllByScreen(screenId);
    return this.mapper.mapArray(seats, Seat, ReadSeatDto);
  }

  async getSeat(theaterId: number, screenId: number, seatId: number) {
    await this.ensureScreenBelongsToTheater(theaterId, screenId);
    const seat = await this.ensureSeatExists(seatId, screenId);
    return this.mapper.map(seat, Seat, ReadSeatDto);
  }

  async updateSeat(
    theaterId: number,
    screenId: number,
    seatId: number,
    payload: UpdateSeatDto,
  ) {
    await this.ensureScreenBelongsToTheater(theaterId, screenId);
    if (!payload || Object.values(payload).every((value) => value === undefined)) {
      throw new BadRequestException('No updates provided');
    }

    const seat = await this.ensureSeatExists(seatId, screenId);
    await this.seatDataService.updateSeat(seat.id, payload);
    const updated = await this.seatDataService.findById(seat.id);
    return this.mapper.map(updated, Seat, ReadSeatDto);
  }

  async deleteSeat(theaterId: number, screenId: number, seatId: number) {
    await this.ensureScreenBelongsToTheater(theaterId, screenId);
    const seat = await this.ensureSeatExists(seatId, screenId);
    await this.seatDataService.deleteSeat(seat.id);
    return this.mapper.map(seat, Seat, ReadSeatDto);
  }
}
