import { ApiProperty } from '@nestjs/swagger';

export class ReadReservationDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  slot_id: number;

  @ApiProperty()
  seat_id: number;

  @ApiProperty()
  reserved_at: Date;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
