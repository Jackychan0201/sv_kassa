import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from './shop.entity';
import * as bcrypt from 'bcrypt';
import { CreateShopDto } from './dto/create-shop.dto';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
  ) {}

  async createShop(dto: CreateShopDto): Promise<Shop> {
    const existingShop = await this.shopRepository.findOne({ where: { email: dto.email } });
    if (existingShop) {
      throw new BadRequestException('Shop with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const shop = this.shopRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    const savedShop = this.shopRepository.save(shop);
    const { password, ...result } = await savedShop;

    return result as Shop;
  }

  findAll(): Promise<Shop[]> {
    return this.shopRepository.find({select: ['id', 'name', 'email', 'createdAt', 'updatedAt']});
  }

  async findOne(id: string): Promise<Shop> {
    const shop = await this.shopRepository.findOne({
         where: { id },
         select: ['id', 'name', 'email', 'createdAt', 'updatedAt'], 
        });
    if (!shop) {
      throw new Error(`Shop with id ${id} not found`);
    }
    return shop;
  }
}
