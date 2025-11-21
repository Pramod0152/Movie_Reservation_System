import { Module } from '@nestjs/common';
import { TheaterController } from './theater.controller';

@Module({
  controllers: [TheaterController],
})
export class TheaterModule {}
