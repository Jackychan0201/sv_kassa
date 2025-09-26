import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'shop1@example.com', description: 'Shop login email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '1111', description: 'Shop password' })
  password: string;
}
