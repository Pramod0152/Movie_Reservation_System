import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from './base.service';
import { MovieDataService } from '../dal/movie.data.service';
import { MapperService } from '../dal/profile';
import { Movie } from '../dal/entities/movie.entity';
import { CreateMovieDto } from '../dto/movie/create-movie.dto';
import { UpdateMovieDto } from '../dto/movie/update-movie.dto';
import { ReadMovieDto } from '../dto/movie/read-movie.dto';

@Injectable()
export class MovieService extends BaseService {
  constructor(
    private readonly movieDataService: MovieDataService,
    private readonly mapper: MapperService,
  ) {
    super();
  }

  async createMovie(payload: CreateMovieDto) {
    const movie = await this.movieDataService.createMovie(payload);
    return this.mapper.map(movie, Movie, ReadMovieDto);
  }

  async getMovies() {
    const movies = await this.movieDataService.findAllMovies();
    return this.mapper.mapArray(movies, Movie, ReadMovieDto);
  }

  async getMovie(id: number) {
    const movie = await this.movieDataService.findById(id);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return this.mapper.map(movie, Movie, ReadMovieDto);
  }

  async updateMovie(id: number, payload: UpdateMovieDto) {
    const movie = await this.movieDataService.findById(id);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    await this.movieDataService.updateMovie(id, payload);
    const updated = await this.movieDataService.findById(id);
    return this.mapper.map(updated, Movie, ReadMovieDto);
  }

  async deleteMovie(id: number) {
    const movie = await this.movieDataService.findById(id);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    await this.movieDataService.deleteMovie(id);
    return this.mapper.map(movie, Movie, ReadMovieDto);
  }
}
