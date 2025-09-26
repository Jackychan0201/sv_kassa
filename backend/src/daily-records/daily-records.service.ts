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

    const shop = await this.shopRepo.findOne({ where: { id: dto.shopId }, select: ['id'] });
    if (!shop) {
      throw new NotFoundException(`Shop with id ${dto.shopId} not found`);
    }

    const [day, month, year] = dto.recordDate.split('.');
    const isoDate = `${year}-${month}-${day}`;

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

  async findOneById(id: string): Promise<DailyRecord | null> {
    return this.dailyRecordRepo.findOne({
      where: { id },
      select: ['id', 'shopId', 'revenueMainWithMargin', 'revenueMainWithoutMargin', 'revenueOrderWithMargin', 'revenueOrderWithoutMargin', 'mainStockValue', 'orderStockValue', 'createdAt', 'updatedAt'],
    });
  }

  async findAll(user: JwtShop, shopId?: string): Promise<DailyRecord[]> {
    if (user.role === ShopRole.SHOP) {
      shopId = user.shopId;
    }

    if (user.role === ShopRole.CEO && !shopId) {
      return this.dailyRecordRepo.find({
        relations: [],
        order: { createdAt: 'DESC' },
      });
    }

    const shop = await this.shopRepo.findOne({ where: { id: shopId } });
    if (!shop) {
      throw new NotFoundException(`Shop with id ${shopId} not found`);
    }

    return this.dailyRecordRepo.find({
      where: shopId ? { shopId } : {},
      order: { createdAt: 'DESC' },
    });
  }
}
