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
  Request,
  Query,
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
import { FilterSeatDto } from '../../dto/seat/filter-seat.dto';

@ApiTags('Seats')
@Controller('seats')
@ApiBearerAuth()
@ApiExtraModels(ReadSeatDto, GenericResponseDto)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('theater')
export class SeatController {
  constructor(
    private readonly seatService: SeatService,
    private readonly responseHandler: ResponseHandlerService,
  ) {}

  @Post('/')
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
  async createSeatLayout(@Body() body: CreateSeatLayoutDto, @Request() req: any) {
    const seats = await this.seatService.createSeatLayout(req.user.id, body.screen_id, body);
    return this.responseHandler.handleResponse(seats, 'Seat layout created successfully');
  }

  @Get('/')
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
  async getSeatLayout(@Query() query: FilterSeatDto) {
    const seats = await this.seatService.getSeatLayout(query.screen_id);
    return this.responseHandler.handleResponse(seats);
  }

  @Get('/:id')
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
  async getSeat(@Param('id', ParseIntPipe) id: number, @Query() query: FilterSeatDto) {
    const seat = await this.seatService.getSeat(query.screen_id, id);
    return this.responseHandler.handleResponse(seat);
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
  @ApiGenericResponse({ type: () => ReadSeatDto })
  async updateSeat(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateSeatDto,
    @Query() query: FilterSeatDto,
  ) {
    const seat = await this.seatService.updateSeat(req.user.id, query.screen_id, id, payload);
    return this.responseHandler.handleResponse(seat, 'Seat updated successfully');
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
  @ApiGenericResponse({ type: () => ReadSeatDto })
  async deleteSeat(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Query() query: FilterSeatDto,
  ) {
    const seat = await this.seatService.deleteSeat(req.user.id, query.screen_id, id);
    return this.responseHandler.handleResponse(seat, 'Seat deleted successfully');
  }
}
