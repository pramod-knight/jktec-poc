import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/role.decorator';
import { RoleEnum } from '../enum/role.enum';
import { RoleCheckGuard } from '../auth/role.guard';

@ApiTags("user-endpoints")
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/list')
  @UseGuards(JwtAuthGuard,RoleCheckGuard)
  @Roles([RoleEnum.ADMIN])
  @ApiBearerAuth()
  findAll() {
    return this.usersService.findAll();
  }
}
