import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Public } from '../../app/decorator/is-public.decorator';
import { ApiGenericResponse } from '../../app/decorator/generic-response.decorator';
import { ResponseHandlerService } from '../../common/response/response-handler.service';

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

  @Post('register')
  @Public()
  @ApiGenericResponse({ type: () => CreateUserDto })
  async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.authService.registerUser(createUserDto);
    return this.responseHandler.handleResponse(
      result,
      'User registered successfully',
    );
  }
}
