import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { createMock } from '@golevelup/ts-jest';
import { ThrottlerModule } from '@nestjs/throttler';
describe('UsersController', () => {
  let controller: UsersController;

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
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
