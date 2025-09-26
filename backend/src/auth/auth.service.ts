import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ShopsService } from '../shops/shops.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly shopsService: ShopsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(email: string, password: string) {
    const shop = await this.shopsService.findByEmail(email);
    if (!shop) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(password, shop.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: shop.id, email: shop.email, role: shop.role };

    const expiresInSec = this.configService.get<number>('JWT_EXPIRES_IN', 86400);
    const token = this.jwtService.sign(payload, { expiresIn: expiresInSec });

    return { token, expiresInMs: expiresInSec * 1000 };
  }

}
