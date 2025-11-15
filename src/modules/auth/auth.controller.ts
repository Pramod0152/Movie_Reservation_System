import { Body, Controller, Get, Post, UseGuards, Request, Param, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from '../../app/decorator/is-public.decorator';
import { ApiGenericResponse } from '../../app/decorator/generic-response.decorator';
import { ResponseHandlerService } from '../../common/response/response-handler.service';
import { LoginDto } from '../../dto/user/login.dto';
import { GenericResponseDto } from '../../dto/generic-response.dto';
import { ReadUserDto } from '../../dto/user/read-user.dto';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
@ApiExtraModels(CreateUserDto, ReadUserDto, LoginDto, GenericResponseDto)
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseHandler: ResponseHandlerService,
  ) {}

  @Post('login')
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
  @ApiGenericResponse({ type: () => ReadUserDto })
  async login(@Body() body: LoginDto) {
    const result = await this.authService.login(body);
    return this.responseHandler.handleResponse(result);
  }

  @Post('register')
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
  @ApiGenericResponse({ type: () => ReadUserDto })
  async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.authService.registerUser(createUserDto);
    return this.responseHandler.handleResponse(result);
  }

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
  @Public()
  @ApiGenericResponse({ type: () => ReadUserDto })
  async allUsers() {
    const result = await this.authService.getAllUsers();
    return this.responseHandler.handleResponse(result);
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
  @Public()
  @ApiGenericResponse({ type: () => ReadUserDto })
  async getMyProfile(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    const result = await this.authService.getMyProfile(id);
    return this.responseHandler.handleResponse(result);
  }

  @Get('/another-me')
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
  @Public()
  @ApiGenericResponse({ type: () => ReadUserDto })
  async anotherMe(@Request() req: any) {
    const result = await this.authService.getAnotherMe();
    return this.responseHandler.handleResponse(result);
  }
}
