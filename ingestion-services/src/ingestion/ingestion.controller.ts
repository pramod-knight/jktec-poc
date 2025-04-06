import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IngestionService } from './ingestion.service';
import { AddIngestionDTO } from './dto/add-ingestion';

@Controller()
export class IngestionController {
  constructor(private readonly ingService: IngestionService) {}

  @MessagePattern('add.ingestion')
  async addIngestion(data: AddIngestionDTO) {
    console.log(data)
    const ingestion = await this.ingService.addIngestion(data);

    return {
      message: 'Successfully added',
      ingestion,
    };
  }

  @MessagePattern('get.ingestion')
  async getIngestion(id: number) {
    const ingestion = await this.ingService.getIngestion(id);

    return {
      message: 'Successfully fetched',
      ingestion,
    };
  }
}