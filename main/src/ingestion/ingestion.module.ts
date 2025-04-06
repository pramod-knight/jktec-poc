import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from '../documents/entities/document.entity';
import { User } from '../users/entities/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports:[
    TypeOrmModule.forFeature([User, DocumentEntity]),
    ClientsModule.registerAsync([
      {
        imports:[ConfigModule],
        name:'INGESTION_SERVICE',
        useFactory:async (configService:ConfigService)=>({
            transport:Transport.TCP,
            options:{
            host:configService.get<string>('userServiceHost'),
            port:configService.get<number>('userServicePort')
          }
        }),
        inject:[ConfigService]
      }
    ])
  ],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}
