import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationQueryController } from './reservation-query.controller';

@Module({
  controllers: [ReservationController, ReservationQueryController],
})
export class ReservationModule {}
