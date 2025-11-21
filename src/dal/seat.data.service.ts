import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseDataService } from './base.data.service';
import { Seat } from './entities/seats.entity';
import { CreateSeatDto } from '../dto/seat/create-seat.dto';
import { UpdateSeatDto } from '../dto/seat/update-seat.dto';
import { Op } from 'sequelize';

@Injectable()
export class SeatDataService extends BaseDataService {
  constructor(@InjectModel(Seat) private readonly model: typeof Seat) {
    super();
  }

  async createSeats(screenId: number, seats: CreateSeatDto[]) {
    if (!Array.isArray(seats) || seats.length === 0) {
      return [];
    }

    const payload = seats.map((seat) => ({
      screen_id: screenId,
      seat_number: seat.seat_number,
    }));

    const created = await this.model.bulkCreate(payload);
    return created;
  }

  async findAllByScreen(screenId: number) {
    return this.model.findAll({ where: { screen_id: screenId } });
  }

  async findById(id: number) {
    return this.model.findOne({ where: { id } });
  }

  async findByIdAndScreen(id: number, screenId: number) {
    return this.model.findOne({ where: { id, screen_id: screenId } });
  }

  async findByIds(seatIds: number[]) {
    if (!seatIds.length) {
      return [];
    }

    return this.model.findAll({
      where: {
        id: { [Op.in]: seatIds },
      },
    });
  }

  async findByIdsAndScreen(seatIds: number[], screenId: number) {
    if (!seatIds.length) {
      return [];
    }

    return this.model.findAll({
      where: {
        id: { [Op.in]: seatIds },
        screen_id: screenId,
      },
    });
  }

  async updateSeat(id: number, payload: UpdateSeatDto) {
    const sanitized = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined),
    );

    if (!Object.keys(sanitized).length) {
      return [0];
    }

    return this.model.update(sanitized, { where: { id } });
  }

  async deleteSeat(id: number) {
    return this.model.destroy({ where: { id } });
  }
}
