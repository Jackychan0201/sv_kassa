import { Controller, Post, Body, Get } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { Shop } from './shop.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateShopDto } from './dto/create-shop.dto';

@ApiTags('shops')
@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shop' })
  @ApiResponse({ status: 201, description: 'Shop created successfully.', type: Shop })
  async create(@Body() dto: CreateShopDto): Promise<Shop> {
    return this.shopsService.createShop(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shops' })
  @ApiResponse({ status: 200, description: 'List of shops.', type: [Shop] })
  findAll(): Promise<Shop[]> {
    return this.shopsService.findAll();
  }
}
