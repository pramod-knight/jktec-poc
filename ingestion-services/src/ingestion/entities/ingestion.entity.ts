import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
export enum IngestionStatusEnum {
  ACTIVE = 'ACTIVE',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}
@Entity({ name: 'ingestions' })
export class IngestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'document_id', unique: true })
  documentId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ enum: IngestionStatusEnum, enumName: 'Status',nullable:true })
  status: IngestionStatusEnum;

  @CreateDateColumn({ name: 'ingested_at' })
  ingestedAt: Date;
}