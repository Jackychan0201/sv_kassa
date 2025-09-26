import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Shop } from '../shops/shop.entity';

@Entity('daily_records')
export class DailyRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  shopId: string;

  @ManyToOne(() => Shop, (shop) => shop.dailyRecords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shopId' })
  shop: Shop;

  @Column('bigint', { default: 0 })
  revenueMainWithMargin: number;

  @Column('bigint', { default: 0 })
  revenueMainWithoutMargin: number;

  @Column('bigint', { default: 0 })
  revenueOrderWithMargin: number;

  @Column('bigint', { default: 0 })
  revenueOrderWithoutMargin: number;

  @Column('bigint', { default: 0 })
  mainStockValue: number;

  @Column('bigint', { default: 0 })
  orderStockValue: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
