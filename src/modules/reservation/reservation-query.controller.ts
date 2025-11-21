import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReservationService } from '../../bll/reservation.service';
import { ResponseHandlerService } from '../../common/response/response-handler.service';
import { GenericResponseDto } from '../../dto/generic-response.dto';
import { SlotAvailabilityDto } from '../../dto/slot/slot-availability.dto';
import { ApiGenericResponse } from '../../app/decorator/generic-response.decorator';
import { Public } from '../../app/decorator/is-public.decorator';
import { MovieShowtimeDto } from '../../dto/movie/movie-showtime.dto';
import { TheaterMoviesDto } from '../../dto/theater/theater-movies.dto';

@ApiTags('Availability')
@Controller()
@ApiExtraModels(SlotAvailabilityDto, MovieShowtimeDto, TheaterMoviesDto, GenericResponseDto)
export class ReservationQueryController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly responseHandler: ResponseHandlerService,
  ) {}

  @Get('slots/:slotId/available-seats')
  @Public()
  @ApiNotFoundResponse({ type: GenericResponseDto, description: 'Record Not Found!.' })
  @ApiBadRequestResponse({ type: GenericResponseDto, description: 'Form Validation Error!.' })
  @ApiGenericResponse({ type: () => SlotAvailabilityDto })
  async getSlotAvailability(@Param('slotId', ParseIntPipe) slotId: number) {
    const result = await this.reservationService.getSlotAvailability(slotId);
    return this.responseHandler.handleResponse(result);
  }

  @Get('movies/:movieId/showtimes')
  @Public()
  @ApiNotFoundResponse({ type: GenericResponseDto, description: 'Record Not Found!.' })
  @ApiBadRequestResponse({ type: GenericResponseDto, description: 'Form Validation Error!.' })
  @ApiGenericResponse({ type: () => MovieShowtimeDto, isArray: true })
  async getMovieShowtimes(@Param('movieId', ParseIntPipe) movieId: number) {
    const result = await this.reservationService.getMovieShowtimes(movieId);
    return this.responseHandler.handleResponse(result);
  }

  @Get('theaters/:theaterId/movies')
  @Public()
  @ApiNotFoundResponse({ type: GenericResponseDto, description: 'Record Not Found!.' })
  @ApiBadRequestResponse({ type: GenericResponseDto, description: 'Form Validation Error!.' })
  @ApiGenericResponse({ type: () => TheaterMoviesDto, isArray: true })
  async getTheaterMovies(@Param('theaterId', ParseIntPipe) theaterId: number) {
    const result = await this.reservationService.getTheaterMovies(theaterId);
    return this.responseHandler.handleResponse(result);
  }
}
