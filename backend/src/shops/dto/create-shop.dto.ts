import { ApiProperty } from '@nestjs/swagger';

export class CreateShopDto {
  @ApiProperty({ example: 'Shop 1', description: 'Name of the shop' })
  name: string;

  @ApiProperty({ example: 'shop1@example.com', description: 'Login email of the shop' })
  email: string;

  @ApiProperty({ example: '1111', description: 'Password for the shop' })
  password: string;
}
