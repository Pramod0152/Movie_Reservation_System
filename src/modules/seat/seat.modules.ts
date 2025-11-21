import { Module } from '@nestjs/common';
import { SeatController } from './seat.controller';

@Module({
  controllers: [SeatController],
})
export class SeatModule {}
