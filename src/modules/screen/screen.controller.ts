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
import { FilterScreenDto } from '../../dto/screen/filter-screen.dto';

@ApiTags('Screens')
@Controller('screens')
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
  async createScreen(@Request() req: any, @Body() payload: CreateScreenDto) {
    const screen = await this.screenService.createScreen(req.user.id, payload);
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
  async getScreens(@Query() query: FilterScreenDto) {
    const screens = await this.screenService.getScreens(query.theater_id);
    return this.responseHandler.handleResponse(screens);
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
  @ApiGenericResponse({ type: () => ReadScreenDto })
  async getScreen(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: FilterScreenDto,
  ) {
    const screen = await this.screenService.getScreen(query.theater_id, id);
    return this.responseHandler.handleResponse(screen);
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
  @ApiGenericResponse({ type: () => ReadScreenDto })
  async updateScreen(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateScreenDto,
  ) {
    const screen = await this.screenService.updateScreen(req.user.id, id, payload);
    return this.responseHandler.handleResponse(screen, 'Screen updated successfully');
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
  @ApiGenericResponse({ type: () => ReadScreenDto })
  async deleteScreen(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const screen = await this.screenService.deleteScreen(req.user.id, id);
    return this.responseHandler.handleResponse(screen, 'Screen deleted successfully');
  }
}
