import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';
import { Shop } from './shop.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shop]),
    forwardRef(() => AuthModule), // ✅ forwardRef here too
  ],
  providers: [ShopsService],
  controllers: [ShopsController],
  exports: [TypeOrmModule, ShopsService],
})
export class ShopsModule {}
