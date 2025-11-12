import { Global, Module } from '@nestjs/common';
import { DalModule } from '../dal/dal.modules';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Global()
@Module({
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class MainModules {}
