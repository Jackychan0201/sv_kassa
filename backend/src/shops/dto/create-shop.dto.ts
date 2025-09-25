import { ApiProperty } from '@nestjs/swagger';
import { ShopRole } from '../shop.entity';

export class CreateShopDto {
  @ApiProperty({ example: 'Shop 1', description: 'Name of the shop' })
  name: string;

  @ApiProperty({ example: 'shop1@example.com', description: 'Login email of the shop' })
  email: string;

  @ApiProperty({ example: '1111', description: 'Password for the shop' })
  password: string;

  @ApiProperty({
    example: ShopRole.SHOP,
    description: 'Role of the shop (default is SHOP)',
    enum: ShopRole,
  })
  role: ShopRole;
}
