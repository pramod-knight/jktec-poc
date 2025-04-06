import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StreamableFile } from '@nestjs/common';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let service: DeepMocked<DocumentsService>;
  let reflect: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        Reflector,
        {
          provide: DocumentsService,
          useValue: createMock<DocumentsService>(),
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue(createMock<JwtAuthGuard>())
    .compile();

    controller = module.get<DocumentsController>(DocumentsController);
    service = module.get(DocumentsService);
    reflect = module.get(Reflector);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it("should create document", async () => {
    jest.spyOn(service, "create").mockResolvedValue({
      id: 1,
    } as any);

    const document = {
      fieldname: "document",
      originalname: "test.txt",
      encoding: "7bit",
      mimetype: "text/plain",
      buffer: Buffer.from("test"),
      size: 4,
    };

    const result = await controller.create(document as any);

    expect(service.create).toHaveBeenCalledWith(document);
    expect(result).toStrictEqual({
      message: "Document created",
      document: {
        id: 1,
      },
      status:1
    });
  });

  it("should get document by Id", async () => {
    const stream = {
      pipe: jest.fn(),
    };

    jest.spyOn(service, "retrieveDocumentById").mockResolvedValue(stream as any);

    const result = await controller.getDocumentById("1");

    expect(service.retrieveDocumentById).toHaveBeenCalledWith("1");
    expect(result).toBeInstanceOf(StreamableFile);
  });

  it("should call to update document by ID", async () => {
    jest.spyOn(service, "updateDocument").mockResolvedValue({
      id: "1",
    } as any);

    const document = {
      fieldname: "document",
      originalname: "test.txt",
      encoding: "7bit",
      mimetype: "text/plain",
      buffer: Buffer.from("test"),
      size: 4,
    };

    const result = await controller.updateDocument("1", document as any);

    expect(service.updateDocument).toHaveBeenCalledWith("1", document);
    expect(result).toEqual({
      message: "Document updated",
      status:1
    });
  });

  it("should call to delete Document", async () => {
    jest.spyOn(service, "deleteDocument").mockResolvedValue({
      id: "1",
    } as any);

    const result = await controller.deleteDocument("1");

    expect(service.deleteDocument).toHaveBeenCalledWith('1');
    expect(result).toEqual({
      message: "Document deleted",
      status:1
    });
  });
});
