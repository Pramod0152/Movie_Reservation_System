import { ResponseHandlerService } from './../../common/response/response-handler.service';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReadUserDto } from '../../dto/user/read-user.dto';
import { GenericResponseDto } from '../../dto/generic-response.dto';
import { ApiGenericResponse } from '../../app/decorator/generic-response.decorator';
import { UserService } from '../../bll/user.service';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
@ApiExtraModels(ReadUserDto, GenericResponseDto)
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly responseHandlerService: ResponseHandlerService,
  ) {}

  @Get('/')
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
  @ApiGenericResponse({ type: () => ReadUserDto })
  async getUsers() {
    const users = await this.userService.getUsers();
    return this.responseHandlerService.handleResponse(users);
  }

  @Get('/profile')
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
  @ApiGenericResponse({ type: () => ReadUserDto })
  async getProfile(@Request() req: any) {
    const user = await this.userService.getUserProfile(req.user.id);
    return this.responseHandlerService.handleResponse(user);
  }
}
