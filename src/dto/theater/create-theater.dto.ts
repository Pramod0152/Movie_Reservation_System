import { ApiProperty } from '@nestjs/swagger';

export class CreateTheaterDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  location: string;
}
