import { ApiProperty } from '@nestjs/swagger';

export class CreateSlotDto {
  @ApiProperty()
  movie_id: number;

  @ApiProperty()
  start_time: Date;

  @ApiProperty()
  end_time: Date;
}
