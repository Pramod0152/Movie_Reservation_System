import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from './base.service';
import { ScreenDataService } from '../dal/screen.data.service';
import { TheaterDataService } from '../dal/theater.data.service';
import { MapperService } from '../dal/profile';
import { Screen } from '../dal/entities/screens.entity';
import { ReadScreenDto } from '../dto/screen/read-screen.dto';
import { CreateScreenDto } from '../dto/screen/create-screen.dto';
import { UpdateScreenDto } from '../dto/screen/update-screen.dto';

@Injectable()
export class ScreenService extends BaseService {
  constructor(
    private readonly screenDataService: ScreenDataService,
    private readonly theaterDataService: TheaterDataService,
    private readonly mapper: MapperService,
  ) {
    super();
  }

  private async ensureTheaterExists(theaterId: number) {
    const theater = await this.theaterDataService.findById(theaterId);
    if (!theater) {
      throw new NotFoundException('Theater not found');
    }
    return theater;
  }

  private async ensureScreenExists(screenId: number, theaterId: number) {
    const screen = await this.screenDataService.findByIdAndTheater(screenId, theaterId);
    if (!screen) {
      throw new NotFoundException('Screen not found');
    }
    return screen;
  }

  async createScreen(theaterId: number, payload: CreateScreenDto) {
    await this.ensureTheaterExists(theaterId);
    const screen = await this.screenDataService.createScreen(theaterId, payload);
    return this.mapper.map(screen, Screen, ReadScreenDto);
  }

  async getScreens(theaterId: number) {
    await this.ensureTheaterExists(theaterId);
    const screens = await this.screenDataService.findAllByTheater(theaterId);
    return this.mapper.mapArray(screens, Screen, ReadScreenDto);
  }

  async getScreen(theaterId: number, screenId: number) {
    const screen = await this.ensureScreenExists(screenId, theaterId);
    return this.mapper.map(screen, Screen, ReadScreenDto);
  }

  async updateScreen(theaterId: number, screenId: number, payload: UpdateScreenDto) {
    const screen = await this.ensureScreenExists(screenId, theaterId);
    await this.screenDataService.updateScreen(screen.id, payload);
    const updated = await this.screenDataService.findById(screen.id);
    return this.mapper.map(updated, Screen, ReadScreenDto);
  }

  async deleteScreen(theaterId: number, screenId: number) {
    const screen = await this.ensureScreenExists(screenId, theaterId);
    await this.screenDataService.deleteScreen(screen.id);
    return this.mapper.map(screen, Screen, ReadScreenDto);
  }
}
