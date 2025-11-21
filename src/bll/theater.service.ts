import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from './base.service';
import { TheaterDataService } from '../dal/theater.data.service';
import { MapperService } from '../dal/profile';
import { Theater } from '../dal/entities/theaters.entity';
import { CreateTheaterDto } from '../dto/theater/create-theater.dto';
import { UpdateTheaterDto } from '../dto/theater/update-theater.dto';
import { ReadTheaterDto } from '../dto/theater/read-theater.dto';

@Injectable()
export class TheaterService extends BaseService {
  constructor(
    private readonly theaterDataService: TheaterDataService,
    private readonly mapper: MapperService,
  ) {
    super();
  }

  async getTheaters() {
    const theaters = await this.theaterDataService.findAllTheaters();
    return this.mapper.mapArray(theaters, Theater, ReadTheaterDto);
  }

  async getTheaterById(id: number) {
    const theater = await this.theaterDataService.findById(id);
    if (!theater) {
      throw new NotFoundException('Theater not found');
    }
    return this.mapper.map(theater, Theater, ReadTheaterDto);
  }

  async updateTheater(id: number, item: UpdateTheaterDto) {
    const existing = await this.theaterDataService.findById(id);
    if (!existing) {
      throw new NotFoundException('Theater not found');
    }

    await this.theaterDataService.updateTheater(id, item);
    const updatedTheater = await this.theaterDataService.findById(id);
    return this.mapper.map(updatedTheater, Theater, ReadTheaterDto);
  }

  async deleteTheater(id: number) {
    const theater = await this.theaterDataService.findById(id);
    if (!theater) {
      throw new NotFoundException('Theater not found');
    }

    await this.theaterDataService.deleteTheater(id);
    return this.mapper.map(theater, Theater, ReadTheaterDto);
  }
}
