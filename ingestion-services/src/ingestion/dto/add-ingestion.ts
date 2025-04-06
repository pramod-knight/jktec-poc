import { IsDefined, IsNumber, IsString, IsUUID } from 'class-validator';

export class AddIngestionDTO {
  @IsUUID()
  @IsDefined()
  documentId: string;

  @IsUUID()
  @IsDefined()
  userId: string;
}