import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsStrongPassword, IsString } from 'class-validator';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class SignupDto extends CreateUserDto {}

export class LoginDto {
  @ApiProperty({
    name: 'email',
    type: 'string',
    default: 'demo@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    name: 'password',
    type: 'string',
    default: 'StrongPassword',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
