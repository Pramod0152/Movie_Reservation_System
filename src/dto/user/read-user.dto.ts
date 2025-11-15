import { ApiProperty } from '@nestjs/swagger';

export class ReadUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
