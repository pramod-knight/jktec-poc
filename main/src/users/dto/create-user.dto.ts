import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { RoleEnum } from '../../enum/role.enum';

export class CreateUserDto {
  @ApiProperty({
    name: 'firstName',
    type: 'string',
    default: 'First Name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ name: 'middleName', type: 'string', required: false })
  @IsOptional()
  middleName: string;

  @ApiProperty({
    name: 'lastName',
    type: 'string',
    default: 'Last Name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

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
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    name: 'role',
    type: 'string',
    enum:RoleEnum,
    default: RoleEnum.EDITOR,
  })
  @IsNotEmpty()
  @IsString()
  role: RoleEnum;
}
