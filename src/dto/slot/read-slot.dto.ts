import { ApiProperty } from '@nestjs/swagger';

export class ReadSlotDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  screen_id: number;

  @ApiProperty()
  movie_id: number;

  @ApiProperty()
  start_time: Date;

  @ApiProperty()
  end_time: Date;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
