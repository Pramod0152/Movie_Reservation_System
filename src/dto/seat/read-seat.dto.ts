import { ApiProperty } from '@nestjs/swagger';

export class ReadSeatDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  screen_id: number;

  @ApiProperty()
  seat_number: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
