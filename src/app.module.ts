import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeConfigService } from './app/services/sequelize-congif.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from './app/logger/logger.modules';
import { DalModule } from './dal/dal.modules';
import { ServiceModules } from './bll/service.modules';
import { MainModules } from './modules/main.modules';
import { ResponseModule } from './common/response/response.modules';
import { ExceptionsFilterService } from './app/services/exception-filter.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
      serveStaticOptions: {
        index: false,
      },
    }),
    LoggerModule,
    DalModule,
    MainModules,
    ServiceModules,
    ResponseModule,
  ],
  providers: [
    ConfigService,
    {
      provide: 'APP_FILTER',
      useClass: ExceptionsFilterService,
    },
  ],
})
export class AppModule {}
