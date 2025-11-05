import { ConfigService } from '@nestjs/config';
import {
  SequelizeOptionsFactory,
  SequelizeModuleOptions,
} from '@nestjs/sequelize';
import { config } from 'process';
export class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor(private configService: ConfigService) {}

  createSequelizeOptions(): SequelizeModuleOptions {
    // const DATABASE_NAME = this.configService.get<string>('DATABASE_NAME');
    // const DATABASE_HOST = this.configService.get<string>('DATABASE_HOST');
    // const DATABASE_PORT = this.configService.get<number>('DATABASE_PORT');
    // const DATABASE_USER = this.configService.get<string>('DATABASE_USER');
    // const DATABASE_PASSWORD =
    //   this.configService.get<string>('DATABASE_PASSWORD');

    return {
      dialect: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'dev',
      password: '',
      database: 'movie_reservation',
      autoLoadModels: true,
      synchronize: false,
      define: {
        timestamps: false,
      },
    };
  }
}
