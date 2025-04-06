import { Inject, Injectable } from '@nestjs/common';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentEntity } from '../documents/entities/document.entity';
import { IngestionResponse } from '../interfaces/ingestion.interface';
import { firstValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";
import { ClsService } from 'nestjs-cls';
@Injectable()
export class IngestionService {
  
  constructor(
    @Inject('INGESTION_SERVICE')
    private readonly ingestionClient: ClientProxy,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,
    private readonly clsService: ClsService,
  ) {}
   /**
   *  Add a new ingestion
   * @param createIngestionDto payload to create a new ingestion
   * @returns details of the created ingestion
   */
   addIngestion(createIngestionDto: CreateIngestionDto) {
    return firstValueFrom(
      this.ingestionClient.send<
        IngestionResponse,
        CreateIngestionDto & { userId: number }
      >("add.ingestion", {
        userId: this.clsService.get<number>("authUser.sub"),
        ...createIngestionDto,
      }),
    );
  };

   /**
   * Get details of ingestion by id
   * @param id ingestion id
   * @returns the details of the ingestion
   */
   async findIngestionById(id: string) {
    const response = await firstValueFrom(
      this.ingestionClient.send<IngestionResponse, string>("get.ingestion", id),
    );

    const [document, user] = await Promise.all([
      this.documentRepository.findOneByOrFail({
        id: response.ingestion.documentId,
      }),
      this.userRepository.findOneByOrFail({ id: response.ingestion.userId }),
    ]);

    return {
      id: response.ingestion.id,
      user: {
        id: user.id,
        name: user.firstName,
        email: user.email,
      },
      document: {
        id: document.id,
        name: document.originalName,
      },
      status: response.ingestion.status,
    };
  }
}
