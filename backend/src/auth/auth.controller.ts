import { Controller, Post, Body, Res, Req, UseGuards, BadRequestException, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import type { Request } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login as a shop' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (req.cookies['Authentication']) {
      throw new BadRequestException('You are already logged in. Log out first.');
    }

    const { token, expiresInMs } = await this.authService.login(dto.email, dto.password);

    res.cookie('Authentication', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: expiresInMs,
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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current shop info' })
  async me(@Req() req: Request) {
    return req.user;
  }
}
