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

@ApiTags('Slots')
@Controller('theaters/:theaterId/screens/:screenId/slots')
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
  async createSlot(
    @Param('theaterId', ParseIntPipe) theaterId: number,
    @Param('screenId', ParseIntPipe) screenId: number,
    @Body() payload: CreateSlotDto,
  ) {
    const slot = await this.slotService.createSlot(theaterId, screenId, payload);
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
  async getSlots(
    @Param('theaterId', ParseIntPipe) theaterId: number,
    @Param('screenId', ParseIntPipe) screenId: number,
  ) {
    const slots = await this.slotService.getSlots(theaterId, screenId);
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
    @Param('theaterId', ParseIntPipe) theaterId: number,
    @Param('screenId', ParseIntPipe) screenId: number,
    @Param('slotId', ParseIntPipe) slotId: number,
  ) {
    const slot = await this.slotService.getSlot(theaterId, screenId, slotId);
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
    @Param('theaterId', ParseIntPipe) theaterId: number,
    @Param('screenId', ParseIntPipe) screenId: number,
    @Param('slotId', ParseIntPipe) slotId: number,
    @Body() payload: UpdateSlotDto,
  ) {
    const slot = await this.slotService.updateSlot(theaterId, screenId, slotId, payload);
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
    @Param('theaterId', ParseIntPipe) theaterId: number,
    @Param('screenId', ParseIntPipe) screenId: number,
    @Param('slotId', ParseIntPipe) slotId: number,
  ) {
    const slot = await this.slotService.deleteSlot(theaterId, screenId, slotId);
    return this.responseHandler.handleResponse(slot, 'Slot deleted successfully');
  }
}
