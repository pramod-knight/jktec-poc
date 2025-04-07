import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/role.decorator';
import { RoleCheckGuard } from '../auth/role.guard';
import { RoleEnum } from '../enum/role.enum';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @ApiBearerAuth()
  @ApiResponse({
      status: HttpStatus.CREATED,
      description: "Ingestion created",
    })
    @ApiResponse({
      status: 500,
      description: "Internal Server Error",
    })
    @ApiResponse({status:401,description:'Aunthorized to access'})
    @ApiResponse({status:400,description:'Validation failed'})
    @ApiResponse({status:403,description:'Resource access denied'})
    @ApiResponse({status:429,description:'To many requests'})
  @UseGuards(JwtAuthGuard,RoleCheckGuard)
  @UseGuards(ThrottlerGuard)
  @Roles([RoleEnum.ADMIN,RoleEnum.EDITOR])
  @Post()
  create(@Body() createIngestionDto: CreateIngestionDto) {
    return this.ingestionService.addIngestion(createIngestionDto);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ingestion details",
  })
  @ApiResponse({
    status: 500,
    description: "Internal Server Error",
  })
  @ApiResponse({status:401,description:'Aunthorized to access'})
  @ApiResponse({status:400,description:'Validation failed'})
  @ApiResponse({status:403,description:'Resource access denied'})
  @ApiResponse({status:429,description:'To many requests'})
  @UseGuards(JwtAuthGuard,RoleCheckGuard)
  @UseGuards(ThrottlerGuard)
  @Roles([RoleEnum.ADMIN,RoleEnum.EDITOR,RoleEnum.VISITOR])
  findOne(@Param('id') id: string) {
    return this.ingestionService.findIngestionById(id);
  }
}
