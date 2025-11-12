import { Module, Res } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeConfigService } from './app/services/sequelize-congif.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from './app/logger/logger.modules';
import { DalModule } from './dal/dal.modules';
import { ServiceModules } from './bll/service.modules';
import { MainModules } from './modules/main.modules';
import { ResponseModule } from './common/response/response.modules';

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
    MainModules,
    ServiceModules,
    ResponseModule,
  ],
  providers: [ConfigService]
})
export class AppModule {}
