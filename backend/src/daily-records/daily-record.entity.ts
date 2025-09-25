import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Shop } from '../shops/shop.entity';

@Entity('daily_records')
export class DailyRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Shop, (shop) => shop.dailyRecords, { onDelete: 'CASCADE' })
  shop: Shop;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  revenueMainWithMargin: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  revenueMainWithoutMargin: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  revenueOrderWithMargin: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  revenueOrderWithoutMargin: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  mainStockValue: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  orderStockValue: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
