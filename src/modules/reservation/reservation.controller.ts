import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
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
import { ReservationService } from '../../bll/reservation.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../app/decorator/roles.decorator';
import { CreateReservationDto } from '../../dto/reservation/create-reservation.dto';
import { ReadReservationDto } from '../../dto/reservation/read-reservation.dto';
import { ApiGenericResponse } from '../../app/decorator/generic-response.decorator';
import { GenericResponseDto } from '../../dto/generic-response.dto';

@ApiTags('Reservations')
@Controller('reservations')
@ApiBearerAuth()
@ApiExtraModels(ReadReservationDto, GenericResponseDto)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly responseHandler: ResponseHandlerService,
  ) {}

  @Post()
  @Roles('user')
  @ApiNotFoundResponse({ type: GenericResponseDto, description: 'Record Not Found!.' })
  @ApiBadRequestResponse({ type: GenericResponseDto, description: 'Form Validation Error!.' })
  @ApiUnauthorizedResponse({ type: GenericResponseDto, description: 'Unauthorized!.' })
  @ApiGenericResponse({ type: () => ReadReservationDto, isArray: true })
  async createReservation(@Request() req: any, @Body() payload: CreateReservationDto) {
    const reservations = await this.reservationService.createReservation(req.user.id, payload);
    return this.responseHandler.handleResponse(reservations, 'Reservation created successfully');
  }

  @Get('me')
  @Roles('user')
  @ApiNotFoundResponse({ type: GenericResponseDto, description: 'Record Not Found!.' })
  @ApiBadRequestResponse({ type: GenericResponseDto, description: 'Form Validation Error!.' })
  @ApiUnauthorizedResponse({ type: GenericResponseDto, description: 'Unauthorized!.' })
  @ApiGenericResponse({ type: () => ReadReservationDto, isArray: true })
  async getMyReservations(@Request() req: any) {
    const reservations = await this.reservationService.getReservationsForUser(req.user.id);
    return this.responseHandler.handleResponse(reservations);
  }

  @Get(':id')
  @Roles('user')
  @ApiNotFoundResponse({ type: GenericResponseDto, description: 'Record Not Found!.' })
  @ApiBadRequestResponse({ type: GenericResponseDto, description: 'Form Validation Error!.' })
  @ApiUnauthorizedResponse({ type: GenericResponseDto, description: 'Unauthorized!.' })
  @ApiGenericResponse({ type: () => ReadReservationDto })
  async getReservation(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    const reservation = await this.reservationService.getReservationDetail(req.user.id, id);
    return this.responseHandler.handleResponse(reservation);
  }

  @Delete(':id')
  @Roles('user')
  @ApiNotFoundResponse({ type: GenericResponseDto, description: 'Record Not Found!.' })
  @ApiBadRequestResponse({ type: GenericResponseDto, description: 'Form Validation Error!.' })
  @ApiUnauthorizedResponse({ type: GenericResponseDto, description: 'Unauthorized!.' })
  @ApiGenericResponse({ type: () => ReadReservationDto })
  async cancelReservation(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    const reservation = await this.reservationService.cancelReservation(req.user.id, id);
    return this.responseHandler.handleResponse(reservation, 'Reservation cancelled successfully');
  }
}
