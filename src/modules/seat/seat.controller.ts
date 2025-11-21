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
import { SeatService } from '../../bll/seat.service';
import { GenericResponseDto } from '../../dto/generic-response.dto';
import { ReadSeatDto } from '../../dto/seat/read-seat.dto';
import { ApiGenericResponse } from '../../app/decorator/generic-response.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../app/decorator/roles.decorator';
import { CreateSeatLayoutDto } from '../../dto/seat/create-seat-layout.dto';
import { UpdateSeatDto } from '../../dto/seat/update-seat.dto';
import { Public } from '../../app/decorator/is-public.decorator';

@ApiTags('Seats')
@Controller('theaters/:theaterId/screens/:screenId/seats')
@ApiBearerAuth()
@ApiExtraModels(ReadSeatDto, GenericResponseDto)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('theater')
export class SeatController {
  constructor(
    private readonly seatService: SeatService,
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
  @ApiGenericResponse({ type: () => ReadSeatDto, isArray: true })
  async createSeatLayout(
    @Param('theaterId', ParseIntPipe) theaterId: number,
    @Param('screenId', ParseIntPipe) screenId: number,
    @Body() payload: CreateSeatLayoutDto,
  ) {
    const seats = await this.seatService.createSeatLayout(theaterId, screenId, payload);
    return this.responseHandler.handleResponse(seats, 'Seat layout created successfully');
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
  @ApiGenericResponse({ type: () => ReadSeatDto, isArray: true })
  async getSeatLayout(
    @Param('theaterId', ParseIntPipe) theaterId: number,
    @Param('screenId', ParseIntPipe) screenId: number,
  ) {
    const seats = await this.seatService.getSeatLayout(theaterId, screenId);
    return this.responseHandler.handleResponse(seats);
  }

  @Get('/:seatId')
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
  @ApiGenericResponse({ type: () => ReadSeatDto })
  async getSeat(
    @Param('theaterId', ParseIntPipe) theaterId: number,
    @Param('screenId', ParseIntPipe) screenId: number,
    @Param('seatId', ParseIntPipe) seatId: number,
  ) {
    const seat = await this.seatService.getSeat(theaterId, screenId, seatId);
    return this.responseHandler.handleResponse(seat);
  }

  @Patch('/:seatId')
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
  @ApiGenericResponse({ type: () => ReadSeatDto })
  async updateSeat(
    @Param('theaterId', ParseIntPipe) theaterId: number,
    @Param('screenId', ParseIntPipe) screenId: number,
    @Param('seatId', ParseIntPipe) seatId: number,
    @Body() payload: UpdateSeatDto,
  ) {
    const seat = await this.seatService.updateSeat(theaterId, screenId, seatId, payload);
    return this.responseHandler.handleResponse(seat, 'Seat updated successfully');
  }

  @Delete('/:seatId')
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
  @ApiGenericResponse({ type: () => ReadSeatDto })
  async deleteSeat(
    @Param('theaterId', ParseIntPipe) theaterId: number,
    @Param('screenId', ParseIntPipe) screenId: number,
    @Param('seatId', ParseIntPipe) seatId: number,
  ) {
    const seat = await this.seatService.deleteSeat(theaterId, screenId, seatId);
    return this.responseHandler.handleResponse(seat, 'Seat deleted successfully');
  }
}
