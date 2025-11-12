import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Public } from '../../app/decorator/is-public.decorator';
import { ApiGenericResponse } from '../../app/decorator/generic-response.decorator';
import { ResponseHandlerService } from '../../common/response/response-handler.service';
import { LoginDto } from '../../dto/user/login.dto';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
@ApiExtraModels(CreateUserDto)
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseHandler: ResponseHandlerService,
  ) {}

  @Post('login')
  @Public()
  @ApiGenericResponse({ type: () => LoginDto })
  async login(@Body() body: LoginDto) {
    const result = await this.authService.login(body);
    return this.responseHandler.handleResponse(result);
  }

  @Post('register')
  @Public()
  @ApiGenericResponse({ type: () => CreateUserDto })
  async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.authService.registerUser(createUserDto);
    return this.responseHandler.handleResponse(result);
  }

  @Get('/me')
  @ApiGenericResponse({ type: () => CreateUserDto })
  async getMyProfile(@Request() req: any) {
    const result = await this.authService.getMyProfile(req.user.id);
    return this.responseHandler.handleResponse(result);
  }
}
