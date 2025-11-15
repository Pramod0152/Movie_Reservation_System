import { Global, Module } from '@nestjs/common';
import { UserService } from '../bll/user.service';
@Global()
@Module({
  providers: [UserService],
  exports: [UserService],
})
export class ServiceModules {}
