import { ApiProperty } from '@nestjs/swagger';

export class ReadScreenDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  theater_id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
