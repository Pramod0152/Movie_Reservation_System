import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseHandlerService } from '../../common/response/response-handler.service';
import { MovieService } from '../../bll/movie.service';
import { GenericResponseDto } from '../../dto/generic-response.dto';
import { ReadMovieDto } from '../../dto/movie/read-movie.dto';
import { ApiGenericResponse } from '../../app/decorator/generic-response.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../app/decorator/roles.decorator';
import { CreateMovieDto } from '../../dto/movie/create-movie.dto';
import { UpdateMovieDto } from '../../dto/movie/update-movie.dto';
import { Public } from '../../app/decorator/is-public.decorator';

@ApiTags('Movies')
@Controller('movies')
@ApiBearerAuth()
@ApiExtraModels(ReadMovieDto, GenericResponseDto)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('theater')
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly responseHandler: ResponseHandlerService,
  ) {}

  @Post()
  @ApiNotFoundResponse({
    type: GenericResponseDto,
    description: 'Record Not Found!.',
  })
  @ApiBadRequestResponse({
    type: GenericResponseDto,
    description: 'Form Validation Error!. ',
  })
  @ApiUnauthorizedResponse({
    type: GenericResponseDto,
    description: 'Unauthorized!. ',
  })
  @ApiGenericResponse({ type: () => ReadMovieDto })
  async createMovie(@Body() payload: CreateMovieDto) {
    const movie = await this.movieService.createMovie(payload);
    return this.responseHandler.handleResponse(movie, 'Movie created successfully');
  }

  @Get()
  @Public()
  @ApiNotFoundResponse({
    type: GenericResponseDto,
    description: 'Record Not Found!.',
  })
  @ApiBadRequestResponse({
    type: GenericResponseDto,
    description: 'Form Validation Error!. ',
  })
  @ApiUnauthorizedResponse({
    type: GenericResponseDto,
    description: 'Unauthorized!. ',
  })
  @ApiGenericResponse({ type: () => ReadMovieDto, isArray: true })
  async getMovies() {
    const movies = await this.movieService.getMovies();
    return this.responseHandler.handleResponse(movies);
  }

  @Get('/:id')
  @Public()
  @ApiNotFoundResponse({
    type: GenericResponseDto,
    description: 'Record Not Found!.',
  })
  @ApiBadRequestResponse({
    type: GenericResponseDto,
    description: 'Form Validation Error!. ',
  })
  @ApiUnauthorizedResponse({
    type: GenericResponseDto,
    description: 'Unauthorized!. ',
  })
  @ApiGenericResponse({ type: () => ReadMovieDto })
  async getMovie(@Param('id', ParseIntPipe) id: number) {
    const movie = await this.movieService.getMovie(id);
    return this.responseHandler.handleResponse(movie);
  }

  @Patch('/:id')
  @ApiNotFoundResponse({
    type: GenericResponseDto,
    description: 'Record Not Found!.',
  })
  @ApiBadRequestResponse({
    type: GenericResponseDto,
    description: 'Form Validation Error!. ',
  })
  @ApiUnauthorizedResponse({
    type: GenericResponseDto,
    description: 'Unauthorized!. ',
  })
  @ApiGenericResponse({ type: () => ReadMovieDto })
  async updateMovie(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateMovieDto) {
    const movie = await this.movieService.updateMovie(id, payload);
    return this.responseHandler.handleResponse(movie, 'Movie updated successfully');
  }

  @Delete('/:id')
  @ApiNotFoundResponse({
    type: GenericResponseDto,
    description: 'Record Not Found!.',
  })
  @ApiBadRequestResponse({
    type: GenericResponseDto,
    description: 'Form Validation Error!. ',
  })
  @ApiUnauthorizedResponse({
    type: GenericResponseDto,
    description: 'Unauthorized!. ',
  })
  @ApiGenericResponse({ type: () => ReadMovieDto })
  async deleteMovie(@Param('id', ParseIntPipe) id: number) {
    const movie = await this.movieService.deleteMovie(id);
    return this.responseHandler.handleResponse(movie, 'Movie deleted successfully');
  }
}
