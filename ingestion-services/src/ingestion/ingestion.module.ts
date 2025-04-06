import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { IngestionEntity } from './entities/ingestion.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    EventEmitterModule.forRoot({
      delimiter: '.',
      global: true,
      wildcard: true,
    }),
    TypeOrmModule.forFeature([IngestionEntity]),
  ],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}
