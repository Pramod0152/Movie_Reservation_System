import { Module } from '@nestjs/common';
import { ScreenController } from './screen.controller';

@Module({
  controllers: [ScreenController],
})
export class ScreenModule {}
