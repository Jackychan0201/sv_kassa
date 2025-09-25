import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyRecord } from './daily-record.entity';
import { CreateDailyRecordDto } from './dto/create-daily-record.dto';
import { Shop } from '../shops/shop.entity';

@Injectable()
export class DailyRecordsService {
  constructor(
    @InjectRepository(DailyRecord)
    private readonly dailyRecordRepo: Repository<DailyRecord>,
    @InjectRepository(Shop)
    private readonly shopRepo: Repository<Shop>,
  ) {}

  async create(dto: CreateDailyRecordDto): Promise<DailyRecord> {
    const shop = await this.shopRepo.findOneByOrFail({ id: dto.shopId });

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
