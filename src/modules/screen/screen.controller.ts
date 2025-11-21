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
import { ScreenService } from '../../bll/screen.service';
import { GenericResponseDto } from '../../dto/generic-response.dto';
import { ReadScreenDto } from '../../dto/screen/read-screen.dto';
import { ApiGenericResponse } from '../../app/decorator/generic-response.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../app/decorator/roles.decorator';
import { CreateScreenDto } from '../../dto/screen/create-screen.dto';
import { UpdateScreenDto } from '../../dto/screen/update-screen.dto';
import { Public } from '../../app/decorator/is-public.decorator';

@ApiTags('Screens')
@Controller('theaters/:theaterId/screens')
@ApiBearerAuth()
@ApiExtraModels(ReadScreenDto, GenericResponseDto)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('theater')
export class ScreenController {
  constructor(
    private readonly screenService: ScreenService,
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
  @ApiGenericResponse({ type: () => ReadScreenDto })
  async createScreen(
    @Param('theaterId', ParseIntPipe) theaterId: number,
    @Body() payload: CreateScreenDto,
  ) {
    const screen = await this.screenService.createScreen(theaterId, payload);
    return this.responseHandler.handleResponse(screen, 'Screen created successfully');
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
  @ApiGenericResponse({ type: () => ReadScreenDto, isArray: true })
  async getScreens(@Param('theaterId', ParseIntPipe) theaterId: number) {
    const screens = await this.screenService.getScreens(theaterId);
    return this.responseHandler.handleResponse(screens);
  }

  @Get('/:screenId')
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
  @ApiGenericResponse({ type: () => ReadScreenDto })
  async getScreen(
    @Param('theaterId', ParseIntPipe) theaterId: number,
    @Param('screenId', ParseIntPipe) screenId: number,
  ) {
    const screen = await this.screenService.getScreen(theaterId, screenId);
    return this.responseHandler.handleResponse(screen);
  }

  @Patch('/:screenId')
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
  @ApiGenericResponse({ type: () => ReadScreenDto })
  async updateScreen(
    @Param('theaterId', ParseIntPipe) theaterId: number,
    @Param('screenId', ParseIntPipe) screenId: number,
    @Body() payload: UpdateScreenDto,
  ) {
    const screen = await this.screenService.updateScreen(theaterId, screenId, payload);
    return this.responseHandler.handleResponse(screen, 'Screen updated successfully');
  }

  @Delete('/:screenId')
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
  @ApiGenericResponse({ type: () => ReadScreenDto })
  async deleteScreen(
    @Param('theaterId', ParseIntPipe) theaterId: number,
    @Param('screenId', ParseIntPipe) screenId: number,
  ) {
    const screen = await this.screenService.deleteScreen(theaterId, screenId);
    return this.responseHandler.handleResponse(screen, 'Screen deleted successfully');
  }
}
