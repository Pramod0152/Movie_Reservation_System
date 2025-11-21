import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty()
  slot_id: number;

  @ApiProperty({ type: () => [Number] })
  seat_ids: number[];
}
