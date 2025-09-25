import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min } from 'class-validator';

export class CreateDailyRecordDto {
  @ApiProperty({
    description: 'Shop ID for which the record is created (CEO only, ignored for shops)',
    example: '8a5b0a9e-5f87-45c3-88f5-36d5e92c30f2',
  })
  @IsUUID()
  shopId: string;

  @ApiProperty({ example: 12345, description: 'Revenue from main with margin (cents)' })
  @IsInt()
  @Min(0)
  revenueMainWithMargin: number;

  @ApiProperty({ example: 11000, description: 'Revenue from main without margin (cents)' })
  @IsInt()
  @Min(0)
  revenueMainWithoutMargin: number;

  @ApiProperty({ example: 4500, description: 'Revenue from order with margin (cents)' })
  @IsInt()
  @Min(0)
  revenueOrderWithMargin: number;

  @ApiProperty({ example: 4000, description: 'Revenue from order without margin (cents)' })
  @IsInt()
  @Min(0)
  revenueOrderWithoutMargin: number;

  @ApiProperty({ example: 250000, description: 'Value of main stock (cents)' })
  @IsInt()
  @Min(0)
  mainStockValue: number;

  @ApiProperty({ example: 80000, description: 'Value of order stock (cents)' })
  @IsInt()
  @Min(0)
  orderStockValue: number;
}
