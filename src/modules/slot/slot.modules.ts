import { Module } from '@nestjs/common';
import { SlotController } from './slot.controller';

@Module({
  controllers: [SlotController],
})
export class SlotModule {}
