import { Body, Controller, Post, UseGuards, Req, ForbiddenException, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { DailyRecordsService } from './daily-records.service';
import { CreateDailyRecordDto } from './dto/create-daily-record.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';
import { JwtShop } from 'src/auth/jwt-shop.type';
import { Query } from '@nestjs/common';
import { ShopRole } from 'src/shops/shop.entity';


@ApiTags('daily-records')
@Controller('daily-records')
export class DailyRecordsController {
  constructor(private readonly dailyRecordsService: DailyRecordsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a daily record (CEO can choose shop, shops only for themselves)' })
  async createDailyRecord(@Body() dto: CreateDailyRecordDto, @Req() req: Request) {
    const user = req.user as JwtShop;
    return await this.dailyRecordsService.create(dto, user);
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all daily records by id of the shop (CEO can see all, shops only their own)' })
  @ApiParam({ name: 'shopId', required: false, description: 'Shop ID to filter records (CEO only)' })
  async getDailyRecords(@Req() req: Request, @Query('shopId') shopId?: string) {
    const user = req.user as JwtShop;
    return await this.dailyRecordsService.findAll(user, shopId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a specific daily record by ID (CEO can see all, shops only their own)' })
  @ApiParam({ name: 'id', description: 'Daily record ID (UUID)' })
  async getDailyRecordById(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as JwtShop;
    return await this.dailyRecordsService.findOneById(user, id);
  }
}
