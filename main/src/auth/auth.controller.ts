import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/create-auth.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RoleCheckGuard } from './role.guard';
import { RoleEnum } from '../enum/role.enum';
import { Roles } from './role.decorator';

@ApiTags("auth-endpoints")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "User created",
    example: {
      message: "User Created",
      status: 1,
      accessToken:"Bearer access token"
    },
  })
  @ApiResponse({
    status: 500,
    description: "Internal Server Error",
  })
  @ApiResponse({status:401,description:'User is invalid'})
  @ApiResponse({status:400,description:'Validation failed'})
  @ApiResponse({status:403,description:'Resource access denied'})
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ThrottlerGuard)
  @UseGuards(JwtAuthGuard,RoleCheckGuard)
  @Roles([RoleEnum.ADMIN])
  async authSignup(@Body() payload: SignupDto) {
    const response = await this.authService.registerNewUser(payload);
    return {
      status:1,
      message:'user registered',
      accessToken:response.accessToken
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: "User logged in",
    example: {
      message: "User logged in",
      status: 1,
      accessToken:"Bearer access token"
    },
  })
  @ApiResponse({
    status: 500,
    description: "Internal Server Error",
  })
  @ApiResponse({status:401,description:'User is invalid'})
  @ApiResponse({status:400,description:'Validation failed'})
  @ApiResponse({status:403,description:'Resource access denied'})
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  async authLogin(@Body() payload: LoginDto) {
    const response = await this.authService.login(payload);
    return {
      status:1,
      message:'user logged in',
      accessToken:response.accessToken
    }
  }
}
