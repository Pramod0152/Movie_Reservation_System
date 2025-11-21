import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Theater } from './entities/theaters.entity';
import { BaseDataService } from './base.data.service';
import { CreateTheaterDto } from '../dto/theater/create-theater.dto';
import { UpdateTheaterDto } from '../dto/theater/update-theater.dto';
import { Op } from 'sequelize';

@Injectable()
export class TheaterDataService extends BaseDataService {
  constructor(@InjectModel(Theater) private readonly model: typeof Theater) {
    super();
  }

  async createTheater(item: CreateTheaterDto) {
    return this.model.create({
      name: item.name,
      email: item.email,
      password: item.password,
      location: item.location,
    });
  }

  async findById(id: number) {
    return this.model.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.model.findOne({ where: { email } });
  }

  async findAllTheaters() {
    return this.model.findAll();
  }

  async findByIds(ids: number[]) {
    if (!ids.length) {
      return [];
    }

    return this.model.findAll({
      where: {
        id: { [Op.in]: ids },
      },
    });
  }

  async updateTheater(id: number, item: UpdateTheaterDto) {
    const theater = await this.findById(id);
    if (!theater) {
      return null;
    }
    const updatedTheater = Object.fromEntries(
      Object.entries(item).filter(([_, v]) => v !== undefined),
    );
    return await this.model.update(updatedTheater, { where: { id } });
  }

  async deleteTheater(id: number) {
    return this.model.destroy({ where: { id } });
  }
}
