import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeConfigService } from './app/services/sequelize-congif.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './app/logger/logger.modules';
import { DalModule } from './dal/dal.modules';
import { ServiceModules } from './bll/service.modules';
import { MainModules } from './modules/main.modules';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule,
    DalModule,
    ServiceModules,
    MainModules,
  ],
})
export class AppModule {}
