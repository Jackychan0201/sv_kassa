import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { ShopRole } from '../shop.entity';

export class UpdateShopDto {
  @ApiProperty({ example: '9999', required: false })
  @IsOptional()
  @IsString()
  @MinLength(4)
  password?: string;

  @ApiProperty({ example: 'NewShop', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({example: ShopRole.SHOP, required: false, enum: ShopRole})
  @IsOptional()
  role?: ShopRole;
}
