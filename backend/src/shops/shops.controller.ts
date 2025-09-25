import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { Shop, ShopRole } from './shop.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateShopDto } from './dto/create-shop.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('shops')
@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shop' })
  @ApiResponse({ status: 201, description: 'Shop created successfully.', type: Shop })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ShopRole.CEO)  
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
