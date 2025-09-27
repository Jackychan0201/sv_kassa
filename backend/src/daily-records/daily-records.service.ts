import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
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

    const shop = await this.shopRepo.findOne({ where: { id: dto.shopId }, select: ['id'] });
    if (!shop) {
      throw new NotFoundException(`Shop with id ${dto.shopId} not found`);
    }

    const [day, month, year] = dto.recordDate.split('.');
    const isoDate = `${year}-${month}-${day}`;

    const existingRecord = await this.dailyRecordRepo.findOne({
      where: { shopId: dto.shopId, recordDate: isoDate },
    });
    if (existingRecord) {
      throw new ForbiddenException(`A daily record for shop ${dto.shopId} on ${dto.recordDate} already exists`);
    }

    const record = this.dailyRecordRepo.create({
      shopId: dto.shopId,
      revenueMainWithMargin: dto.revenueMainWithMargin,
      revenueMainWithoutMargin: dto.revenueMainWithoutMargin,
      revenueOrderWithMargin: dto.revenueOrderWithMargin,
      revenueOrderWithoutMargin: dto.revenueOrderWithoutMargin,
      mainStockValue: dto.mainStockValue,
      orderStockValue: dto.orderStockValue,
      recordDate: isoDate,
    });

    return this.dailyRecordRepo.save(record);
  }


  async findOneById(user: JwtShop, recordId: string): Promise<DailyRecord | null> {
    const record = await this.dailyRecordRepo.findOne({
      where: { id: recordId },
      select: ['id', 'shopId', 'recordDate', 'revenueMainWithMargin', 'revenueMainWithoutMargin', 'revenueOrderWithMargin', 'revenueOrderWithoutMargin', 'mainStockValue', 'orderStockValue', 'createdAt', 'updatedAt'],
    });

    if (!record) {
      throw new NotFoundException(`Daily record with id ${recordId} not found`);
    }
    
    if (user.role !== ShopRole.CEO && record.shopId !== user.shopId) {
      throw new ForbiddenException('You are not allowed to access this record');
    }

    const [year, month, day] = record.recordDate.split('-');
    record.recordDate = `${day}.${month}.${year}`;

    console.log('Retrieved record:', record);

    return record;
  }

  async findByDateRange(
    user: JwtShop,
    fromDate: string,
    toDate: string,
    shopId?: string,
  ): Promise<DailyRecord[]> {
    if (!fromDate || !toDate) {
      throw new ForbiddenException('Both fromDate and toDate are required');
    }

    if (user.role === ShopRole.SHOP) {
      shopId = user.shopId;
    }

    const [fromDay, fromMonth, fromYear] = fromDate.split('.');
    const [toDay, toMonth, toYear] = toDate.split('.');
    const isoFrom = `${fromYear}-${fromMonth}-${fromDay}`;
    const isoTo = `${toYear}-${toMonth}-${toDay}`;

    const where: any = {
      recordDate: Between(isoFrom, isoTo),
    };

    if (shopId) {
      const shop = await this.shopRepo.findOne({ where: { id: shopId } });
      if (!shop) {
        throw new NotFoundException(`Shop with id ${shopId} not found`);
      }
      where.shopId = shopId;
    }

    const result = await this.dailyRecordRepo.find({
      where,
      order: { recordDate: 'ASC' },
    });

    for (const record of result) {
      const [year, month, day] = record.recordDate.split('-');
      record.recordDate = `${day}.${month}.${year}`;
    }

    return result;
  }


  async findAll(user: JwtShop, shopId?: string): Promise<DailyRecord[]> {
    if (user.role === ShopRole.SHOP) {
      shopId = user.shopId;
    }

    if (user.role === ShopRole.CEO && !shopId) {
      return this.dailyRecordRepo.find({
        relations: [],
        order: { createdAt: 'ASC' },
      });
    }

    const shop = await this.shopRepo.findOne({ where: { id: shopId } });
    if (!shop) {
      throw new NotFoundException(`Shop with id ${shopId} not found`);
    }

    const result = await this.dailyRecordRepo.find({
      where: shopId ? { shopId } : {},
      order: { recordDate: 'ASC' },
    });

    for (const record of result) {
      const [year, month, day] = record.recordDate.split('-');
      record.recordDate = `${day}.${month}.${year}`;
    }

    return result;
  }
}
