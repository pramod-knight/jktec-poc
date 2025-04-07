import { createMock, DeepMocked } from "@golevelup/ts-jest";
import { Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { IngestionController } from "./ingestion.controller";
import { IngestionService } from "./ingestion.service";
import { ThrottlerModule } from "@nestjs/throttler";

describe("IngestionController", () => {
  let controller: IngestionController;
  let service: DeepMocked<IngestionService>;
  let reflect: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        ThrottlerModule.forRoot({
          throttlers: [
            {
              ttl: 60000, //take second (e.g., 60 seconds = 1 minute) 
              limit: 5, // max number of limits per ttl
            },
          ],
        }),
      ],
      controllers: [IngestionController],
      providers: [
        Reflector,
        {
          provide: IngestionService,
          useValue: createMock<IngestionService>(),
        },
      ],
    })
      .compile();

    reflect = module.get(Reflector);
    controller = module.get<IngestionController>(IngestionController);
    service = module.get(IngestionService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

 

  it("should call addIngestion", async () => {
    jest.spyOn(service, "addIngestion").mockResolvedValue({
      message: "success",
      ingestion: {
        documentId: '1',
        id: '1',
        ingestedAt: "2025-04-06T00:00:00.000Z",
        status: "success",
        userId: '1',
      },
    });

    const createIngestionDto = { documentId: 1 };

    const result = await controller.create(createIngestionDto);

    expect(service.addIngestion).toHaveBeenCalledWith(createIngestionDto);
    expect(result).toEqual({
      message: "success",
      ingestion: {
        documentId: '1',
        id: '1',
        ingestedAt: "2025-04-06T00:00:00.000Z",
        status: "success",
        userId: '1',
      },
    });
  });


  it("should call findIngestionById", async () => {
    jest.spyOn(service, "findIngestionById").mockResolvedValue({
      document: {
        id: '1',
        name: "document",
      },
      id: '1',
      user: {
        id: '1',
        email: "email",
        name: "name",
      },
      status: "success",
    });

    const result = await controller.findOne('1');

    expect(service.findIngestionById).toHaveBeenCalledWith('1');
    expect(result).toEqual({
      document: {
        id: '1',
        name: "document",
      },
      id: '1',
      user: {
        id: '1',
        email: "email",
        name: "name",
      },
      status: "success",
    });
  });
});