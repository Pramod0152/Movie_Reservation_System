import { ApiProperty } from '@nestjs/swagger';
import { ReadSeatDto } from '../seat/read-seat.dto';

export class SlotAvailabilityDto {
  @ApiProperty({ type: () => [ReadSeatDto] })
  available: ReadSeatDto[];

  @ApiProperty({ type: () => [ReadSeatDto] })
  reserved: ReadSeatDto[];
}
