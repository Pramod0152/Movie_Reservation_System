import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from './base.service';
import { SlotDataService } from '../dal/slot.data.service';
import { ScreenDataService } from '../dal/screen.data.service';
import { MovieDataService } from '../dal/movie.data.service';
import { MapperService } from '../dal/profile';
import { Slot } from '../dal/entities/slots.entity';
import { ReadSlotDto } from '../dto/slot/read-slot.dto';
import { CreateSlotDto } from '../dto/slot/create-slot.dto';
import { UpdateSlotDto } from '../dto/slot/update-slot.dto';

@Injectable()
export class SlotService extends BaseService {
  constructor(
    private readonly slotDataService: SlotDataService,
    private readonly screenDataService: ScreenDataService,
    private readonly movieDataService: MovieDataService,
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

  private async ensureScreenExists(screenId: number) {
    const screen = await this.screenDataService.findById(screenId);
    if (!screen) {
      throw new NotFoundException('Screen not found');
    }
    return screen;
  }

  private async ensureMovieExists(movieId: number) {
    const movie = await this.movieDataService.findById(movieId);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }

  private async ensureSlotExists(slotId: number, screenId: number) {
    const slot = await this.slotDataService.findByIdAndScreen(slotId, screenId);
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }
    return slot;
  }

  async createSlot(theaterId: number, payload: CreateSlotDto) {
    await this.ensureScreenBelongsToTheater(theaterId, payload.screen_id);
    await this.ensureMovieExists(payload.movie_id);
    const slot = await this.slotDataService.createSlot(payload.screen_id, payload);
    return this.mapper.map(slot, Slot, ReadSlotDto);
  }

  async getSlots(screenId: number) {
    await this.ensureScreenExists(screenId);
    const slots = await this.slotDataService.findAllByScreen(screenId);
    return this.mapper.mapArray(slots, Slot, ReadSlotDto);
  }

  async getSlot(screenId: number, slotId: number) {
    await this.ensureScreenExists(screenId);
    const slot = await this.ensureSlotExists(slotId, screenId);
    return this.mapper.map(slot, Slot, ReadSlotDto);
  }

  async updateSlot(
    theaterId: number,
    screenId: number,
    slotId: number,
    payload: UpdateSlotDto,
  ) {
    await this.ensureScreenBelongsToTheater(theaterId, screenId);
    const slot = await this.ensureSlotExists(slotId, screenId);

    if (payload.movie_id !== undefined) {
      await this.ensureMovieExists(payload.movie_id);
    }

    await this.slotDataService.updateSlot(slot.id, payload);
    const updated = await this.slotDataService.findById(slot.id);
    return this.mapper.map(updated, Slot, ReadSlotDto);
  }

  async deleteSlot(theaterId: number, screenId: number, slotId: number) {
    await this.ensureScreenBelongsToTheater(theaterId, screenId);
    const slot = await this.ensureSlotExists(slotId, screenId);
    await this.slotDataService.deleteSlot(slot.id);
    return this.mapper.map(slot, Slot, ReadSlotDto);
  }
}
