import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentEntity } from './entities/document.entity';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { rm, stat } from "fs/promises";
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity)
    private documentRepository: Repository<DocumentEntity>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * saves the document entry and uploaded file
   * @param document the newly uploaded document
   * @returns void
   */
 async create(document: Express.Multer.File) {
    const newDocument = new DocumentEntity();

    newDocument.originalName = document.originalname;
    newDocument.name = document.filename;
    newDocument.mimeType = document.mimetype;
    try {
      return await this.documentRepository.save(newDocument);
    } catch (error) {
      await rm(document.path);
      throw error;
    }
  };

  /**
   * Fetch document by id
   * 
   * @param id document UUID
   * @returns stream file
   */
  async retrieveDocumentById(id: string) {
    const document = await this.getDocumentById(id);

    // get read stream from the file system
    const readStream = createReadStream(
      join(this.configService.get("UPLOAD_PATH") as string, document.name),
    );
    return readStream;
  };

  async getDocumentById(id: string) {
    const document = await this.documentRepository.findOne({ where: { id } });

    if (!document) {
      throw new NotFoundException("Document not found");
    }

    return document;
  };

  /**
   * update the document with the new one
   * @param id existing document's id
   * @param document new document to replace the old one
   * @returns void
   */
  async updateDocument(id: string, document: Express.Multer.File) {
    const oldDocument = await this.getDocumentById(id);
    const documentToDelete = oldDocument.name;

    oldDocument.originalName = document.originalname;
    oldDocument.name = document.filename;
    oldDocument.mimeType = document.mimetype;

    try {
      await this.documentRepository.save(oldDocument);
      await rm(
        join(this.configService.get("UPLOAD_PATH") as string, documentToDelete),
      );
    } catch (error) {
      await rm(document.path);
      throw error;
    }
  }

  /**
   * delete the document
   * @param id existing document's id
   */
  async deleteDocument(id: string) {
    const document = await this.getDocumentById(id);

    await rm(
      join(this.configService.get("UPLOAD_PATH") as string, document.name),
    );
    await this.documentRepository.remove(document);
  }
}
