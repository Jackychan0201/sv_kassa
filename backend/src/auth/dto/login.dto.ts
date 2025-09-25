import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'shop1@example.com', description: 'Shop login email' })
  email: string;

  @ApiProperty({ example: '1111', description: 'Shop password' })
  password: string;
}
