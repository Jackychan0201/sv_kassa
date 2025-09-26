import { Body, Controller, Post, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DailyRecordsService } from './daily-records.service';
import { CreateDailyRecordDto } from './dto/create-daily-record.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { ShopRole } from '../shops/shop.entity';
import type { Request } from 'express';
import { JwtShop } from 'src/auth/jwt-shop.type';

@ApiTags('daily-records')
@Controller('daily-records')
export class DailyRecordsController {
  constructor(private readonly dailyRecordsService: DailyRecordsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a daily record (CEO can choose shop, shops only for themselves)' })
  async createDailyRecord(@Body() dto: CreateDailyRecordDto, @Req() req: Request) {
    const user = req.user as JwtShop;
    return this.dailyRecordsService.create(dto, user);
  }
}
