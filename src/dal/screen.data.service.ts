import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Screen } from './entities/screens.entity';
import { BaseDataService } from './base.data.service';
import { CreateScreenDto } from '../dto/screen/create-screen.dto';
import { UpdateScreenDto } from '../dto/screen/update-screen.dto';
import { Op } from 'sequelize';

@Injectable()
export class ScreenDataService extends BaseDataService {
  constructor(@InjectModel(Screen) private readonly model: typeof Screen) {
    super();
  }

  async createScreen(theaterId: number, item: CreateScreenDto) {
    return this.model.create({
      name: item.name,
      theater_id: theaterId,
    });
  }

  async findById(id: number) {
    return this.model.findOne({
      where: { id },
    });
  }

  async findByIdAndTheater(id: number, theaterId: number) {
    return this.model.findOne({
      where: { id, theater_id: theaterId },
    });
  }

  async findAllByTheater(theaterId: number) {
    return this.model.findAll({
      where: { theater_id: theaterId },
    });
  }

  async findByIds(screenIds: number[]) {
    if (!screenIds.length) {
      return [];
    }

    return this.model.findAll({
      where: {
        id: { [Op.in]: screenIds },
      },
    });
  }

  async updateScreen(id: number, item: UpdateScreenDto) {
    const payload = Object.fromEntries(
      Object.entries(item).filter(([_, value]) => value !== undefined),
    );
    if (!Object.keys(payload).length) {
      return [0];
    }
    return this.model.update(payload, { where: { id } });
  }

  async deleteScreen(id: number) {
    return this.model.destroy({ where: { id } });
  }
}
