import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './entities/document.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import path from 'path';

@Module({
  imports:[
    MulterModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>({
        dest: configService.get("UPLOAD_PATH"),
        limits: {
          fileSize: configService.get("UPLOAD_MAX_SIZE"),
        },
      })
    }),
    TypeOrmModule.forFeature([DocumentEntity]),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
