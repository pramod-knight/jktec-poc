import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/role.decorator';
import { RoleCheckGuard } from '../auth/role.guard';
import { RoleEnum } from '../enum/role.enum';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @ApiBearerAuth()
 @UseGuards(JwtAuthGuard,RoleCheckGuard)
   @Roles([RoleEnum.ADMIN,RoleEnum.EDITOR])
  @Post()
  create(@Body() createIngestionDto: CreateIngestionDto) {
    return this.ingestionService.addIngestion(createIngestionDto);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard,RoleCheckGuard)
    @Roles([RoleEnum.ADMIN,RoleEnum.EDITOR])
  findOne(@Param('id') id: string) {
    return this.ingestionService.findIngestionById(id);
  }
}
