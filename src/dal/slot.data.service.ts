import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Slot } from './entities/slots.entity';
import { BaseDataService } from './base.data.service';
import { CreateSlotDto } from '../dto/slot/create-slot.dto';
import { UpdateSlotDto } from '../dto/slot/update-slot.dto';
import { Op } from 'sequelize';

@Injectable()
export class SlotDataService extends BaseDataService {
  constructor(@InjectModel(Slot) private readonly model: typeof Slot) {
    super();
  }

  async createSlot(screenId: number, payload: CreateSlotDto) {
    return this.model.create({
      screen_id: screenId,
      movie_id: payload.movie_id,
      start_time: payload.start_time,
      end_time: payload.end_time,
    });
  }

  async findById(id: number) {
    return this.model.findOne({ where: { id } });
  }

  async findByIdAndScreen(id: number, screenId: number) {
    return this.model.findOne({ where: { id, screen_id: screenId } });
  }

  async findAllByScreen(screenId: number) {
    return this.model.findAll({ where: { screen_id: screenId } });
  }

  async findAllByScreenIds(screenIds: number[]) {
    if (!screenIds.length) {
      return [];
    }

    return this.model.findAll({
      where: {
        screen_id: { [Op.in]: screenIds },
      },
    });
  }

  async findAllByMovieId(movieId: number) {
    return this.model.findAll({ where: { movie_id: movieId } });
  }

  async updateSlot(id: number, payload: UpdateSlotDto) {
    const sanitized = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined),
    );

    if (!Object.keys(sanitized).length) {
      return [0];
    }

    return this.model.update(sanitized, { where: { id } });
  }

  async deleteSlot(id: number) {
    return this.model.destroy({ where: { id } });
  }
}
