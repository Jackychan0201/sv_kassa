import { Controller, Post, Body, Get, UseGuards, Patch, Param, Delete, Req, ForbiddenException } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { Shop, ShopRole } from './shop.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateShopDto } from './dto/create-shop.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateShopDto } from './dto/update-shop.dto';
import type { Request } from 'express';
import { JwtShop } from 'src/auth/jwt-shop.type';

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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update shop credentials (CEO can update any, shops only their own)' })
  @ApiResponse({ status: 200, description: 'Shop updated successfully.', type: Shop })
  async update(@Param('id') id: string, @Body() dto: UpdateShopDto, @Req() req: Request): Promise<Shop> {
    const user = req.user as JwtShop;

    if (user.role !== ShopRole.CEO && user.shopId !== id) {
      throw new ForbiddenException('You are not allowed to update this shop');
    }

    if (dto.role && user.role !== ShopRole.CEO) {
      throw new ForbiddenException('Only CEO can change shop roles');
    }

    return this.shopsService.updateShop(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a shop (CEO can delete any, shops only themselves)' })
  @ApiResponse({ status: 200, description: 'Shop deleted successfully.' })
  async delete(@Param('id') id: string, @Req() req: Request): Promise<{ message: string }> {
    const user = req.user as JwtShop;

    if (user.role !== ShopRole.CEO && user.shopId !== id) {
      throw new ForbiddenException('You are not allowed to delete this shop');
    }

    await this.shopsService.deleteShop(id);
    return { message: `Shop with id ${id} deleted successfully` };
  }

  @Get()
  @ApiOperation({ summary: 'Get all shops' })
  @ApiResponse({ status: 200, description: 'List of shops.', type: [Shop] })
  findAll(): Promise<Shop[]> {
    return this.shopsService.findAll();
  }
}
