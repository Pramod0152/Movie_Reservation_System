import { Global, Module } from '@nestjs/common';
import { UserDataService } from './user.data.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { MapperService } from './profile';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UserDataService, MapperService],
  exports: [UserDataService, MapperService],
})
export class DalModule {}
