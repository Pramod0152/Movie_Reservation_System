import { ApiProperty } from '@nestjs/swagger';

class ShowtimeSlotDto {
  @ApiProperty()
  slot_id: number;

  @ApiProperty()
  screen_id: number;

  @ApiProperty()
  screen_name: string;

  @ApiProperty()
  start_time: Date;

  @ApiProperty()
  end_time: Date;
}

export class MovieShowtimeDto {
  @ApiProperty()
  theater_id: number;

  @ApiProperty()
  theater_name: string;

  @ApiProperty()
  theater_location: string;

  @ApiProperty({ type: () => [ShowtimeSlotDto] })
  slots: ShowtimeSlotDto[];
}
