import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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
import { TheaterService } from '../../bll/theater.service';
import { UpdateTheaterDto } from '../../dto/theater/update-theater.dto';
import { ReadTheaterDto } from '../../dto/theater/read-theater.dto';
import { GenericResponseDto } from '../../dto/generic-response.dto';
import { ApiGenericResponse } from '../../app/decorator/generic-response.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../app/decorator/roles.decorator';
import { Public } from '../../app/decorator/is-public.decorator';

@ApiTags('Theaters')
@Controller('theaters')
@ApiBearerAuth()
@ApiExtraModels(ReadTheaterDto, GenericResponseDto)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('theater')
export class TheaterController {
  constructor(
    private readonly theaterService: TheaterService,
    private readonly responseHandler: ResponseHandlerService,
  ) {}

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
  @ApiGenericResponse({ type: () => ReadTheaterDto, isArray: true })
  async getTheaters() {
    const theaters = await this.theaterService.getTheaters();
    return this.responseHandler.handleResponse(theaters);
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
  @ApiGenericResponse({ type: () => ReadTheaterDto })
  async getTheaterById(@Param('id', ParseIntPipe) id: number) {
    const theater = await this.theaterService.getTheaterById(id);
    return this.responseHandler.handleResponse(theater);
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
  @ApiGenericResponse({ type: () => ReadTheaterDto })
  async updateTheater(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTheaterDto) {
    const theater = await this.theaterService.updateTheater(id, body);
    return this.responseHandler.handleResponse(theater, 'Theater updated successfully');
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
  @ApiGenericResponse({ type: () => ReadTheaterDto })
  async deleteTheater(@Param('id', ParseIntPipe) id: number) {
    const theater = await this.theaterService.deleteTheater(id);
    return this.responseHandler.handleResponse(theater, 'Theater deleted successfully');
  }
}
