import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseDataService } from './base.data.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from '../dto/movie/create-movie.dto';
import { UpdateMovieDto } from '../dto/movie/update-movie.dto';
import { Op } from 'sequelize';

@Injectable()
export class MovieDataService extends BaseDataService {
  constructor(@InjectModel(Movie) private readonly model: typeof Movie) {
    super();
  }

  async createMovie(payload: CreateMovieDto) {
    return this.model.create({
      title: payload.title,
      description: payload.description,
      release_date: payload.release_date,
      duration: payload.duration,
    });
  }

  async findAllMovies() {
    return this.model.findAll();
  }

  async findById(id: number) {
    return this.model.findOne({ where: { id } });
  }

  async updateMovie(id: number, payload: UpdateMovieDto) {
    const sanitized = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined),
    );

    if (!Object.keys(sanitized).length) {
      return [0];
    }

    return this.model.update(sanitized, { where: { id } });
  }

  async deleteMovie(id: number) {
    return this.model.destroy({ where: { id } });
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
}
