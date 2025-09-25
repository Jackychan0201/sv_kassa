import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login as a shop' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.login(dto.email, dto.password);

    res.cookie('Authentication', token, {
      httpOnly: true,
      sameSite: 'lax', 
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { message: 'Login successful' };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout the current shop' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('Authentication', {
      httpOnly: true,
      sameSite: 'lax',
    });

    return { message: 'Logged out successfully' };
  }
}
