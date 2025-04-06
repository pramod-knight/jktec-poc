import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from "typeorm";

@Entity({ name: "documents" })
export class DocumentEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column()
    originalName: string;
  
    @Column()
    name: string;
  
    @Column()
    mimeType: string;
  
    @CreateDateColumn()
    uploadedAt: Date;

    @CreateDateColumn()
    updatedAt: Date;
}
