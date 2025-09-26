import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyRecord } from './daily-record.entity';
import { CreateDailyRecordDto } from './dto/create-daily-record.dto';
import { Shop, ShopRole } from '../shops/shop.entity';
import { JwtShop } from '../auth/jwt-shop.type';

@Injectable()
export class DailyRecordsService {
  constructor(
    @InjectRepository(DailyRecord)
    private readonly dailyRecordRepo: Repository<DailyRecord>,
    @InjectRepository(Shop)
    private readonly shopRepo: Repository<Shop>,
  ) {}

  async create(dto: CreateDailyRecordDto, user: JwtShop): Promise<DailyRecord> {
    if (user.role === ShopRole.SHOP) {
      dto.shopId = user.shopId;
    }

    if (user.role === ShopRole.CEO && !dto.shopId) {
      throw new ForbiddenException('CEO must specify a shopId');
    }

    const shop = await this.shopRepo.findOne({ where: { id: dto.shopId } });
    if (!shop) {
      throw new NotFoundException(`Shop with id ${dto.shopId} not found`);
    }

    const record = this.dailyRecordRepo.create({
      shop,
      revenueMainWithMargin: dto.revenueMainWithMargin,
      revenueMainWithoutMargin: dto.revenueMainWithoutMargin,
      revenueOrderWithMargin: dto.revenueOrderWithMargin,
      revenueOrderWithoutMargin: dto.revenueOrderWithoutMargin,
      mainStockValue: dto.mainStockValue,
      orderStockValue: dto.orderStockValue,
    });

    return this.dailyRecordRepo.save(record);
  }
}
