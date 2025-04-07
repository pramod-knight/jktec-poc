import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/role.decorator';
import { RoleEnum } from '../enum/role.enum';
import { RoleCheckGuard } from '../auth/role.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags("user-endpoints")
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/list')
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: "list of users",
  })
  @ApiResponse({
    status: 500,
    description: "Internal Server Error",
  })
  @ApiResponse({status:401,description:'Aunthorized to access'})
  @ApiResponse({status:400,description:'Validation failed'})
  @ApiResponse({status:403,description:'Resource access denied'})
  @ApiResponse({status:429,description:'To many requests'})
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['createdAt', 'updatedAt'],
  })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @UseGuards(JwtAuthGuard,RoleCheckGuard)
  @Roles([RoleEnum.ADMIN])
  @UseGuards(ThrottlerGuard)
  @ApiBearerAuth()
  findAll( 
    @Query('sortBy') sortBy?: 'createdAt' | 'updatedAt',
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,) {
    return this.usersService.findAll(sortBy,
      sortOrder,
      limit,
      offset);
  }
}
