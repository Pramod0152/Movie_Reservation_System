import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
import { SlotService } from '../../bll/slot.service';
import { GenericResponseDto } from '../../dto/generic-response.dto';
import { ReadSlotDto } from '../../dto/slot/read-slot.dto';
import { ApiGenericResponse } from '../../app/decorator/generic-response.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../app/decorator/roles.decorator';
import { CreateSlotDto } from '../../dto/slot/create-slot.dto';
import { UpdateSlotDto } from '../../dto/slot/update-slot.dto';
import { Public } from '../../app/decorator/is-public.decorator';
import { FilterSeatDto } from '../../dto/seat/filter-seat.dto';

@ApiTags('Slots')
@Controller('slots')
@ApiBearerAuth()
@ApiExtraModels(ReadSlotDto, GenericResponseDto)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('theater')
export class SlotController {
  constructor(
    private readonly slotService: SlotService,
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
  @ApiGenericResponse({ type: () => ReadSlotDto })
  async createSlot(@Request() req: any, @Body() payload: CreateSlotDto) {
    const slot = await this.slotService.createSlot(req.user.id, payload);
    return this.responseHandler.handleResponse(slot, 'Slot created successfully');
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
  @ApiGenericResponse({ type: () => ReadSlotDto, isArray: true })
  async getSlots(@Query() query: FilterSeatDto) {
    const slots = await this.slotService.getSlots(query.screen_id);
    return this.responseHandler.handleResponse(slots);
  }

  @Get('/:slotId')
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
  @ApiGenericResponse({ type: () => ReadSlotDto })
  async getSlot(
    @Param('slotId', ParseIntPipe) slotId: number,
    @Query() query: FilterSeatDto,
  ) {
    const slot = await this.slotService.getSlot(query.screen_id, slotId);
    return this.responseHandler.handleResponse(slot);
  }

  @Patch('/:slotId')
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
  @ApiGenericResponse({ type: () => ReadSlotDto })
  async updateSlot(
    @Request() req: any,
    @Param('slotId', ParseIntPipe) slotId: number,
    @Body() payload: UpdateSlotDto,
    @Query() query: FilterSeatDto,
  ) {
    const slot = await this.slotService.updateSlot(req.user.id, query.screen_id, slotId, payload);
    return this.responseHandler.handleResponse(slot, 'Slot updated successfully');
  }

  @Delete('/:slotId')
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
  @ApiGenericResponse({ type: () => ReadSlotDto })
  async deleteSlot(
    @Request() req: any,
    @Param('slotId', ParseIntPipe) slotId: number,
    @Query() query: FilterSeatDto,
  ) {
    const slot = await this.slotService.deleteSlot(req.user.id, query.screen_id, slotId);
    return this.responseHandler.handleResponse(slot, 'Slot deleted successfully');
  }
}
