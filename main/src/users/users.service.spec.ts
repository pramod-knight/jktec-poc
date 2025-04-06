import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { PasswordService } from './password.service';
import { RoleEnum } from '../enum/role.enum';

export const mockUser: User = {
  id: 'uuid',
  firstName: 'firstName',
  middleName: '',
  lastName: 'lastName',
  email: 'email',
  password: 'password',
  isActive: true,
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  role:RoleEnum.ADMIN
};
describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;
  let passwordService: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        PasswordService,
        {
          provide: getRepositoryToken(User),
          /**create Mock  helps to create a mock methods like create findOne, etc*/
          useValue: createMock(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
    passwordService = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to check user exist or not', async () => {
    /**get mockQueryFunction */
    const findOneSpyFn = jest.spyOn(repo, 'findOne').mockResolvedValue(null);

    expect(await service.isUserExist('email@test.com')).toBe(null);
    expect(findOneSpyFn).toHaveBeenCalledWith({
      where: {
        email: 'email@test.com',
      },
    });
  });

  it('should be able to create a new User', async () => {
    /**get mockQueryFunction */
    const createSpyFn = jest
      .spyOn(repo, 'create')
      .mockReturnValue(mockUser as any);

    const passwordSpyFn = jest
      .spyOn(passwordService, 'generate')
      .mockResolvedValue('password-hash');

    const saveSpyFn = jest.spyOn(repo, 'save').mockResolvedValue(mockUser);

    const newUser = await service.create({
      firstName: 'firstName',
      middleName: '',
      lastName: 'lastName',
      email: 'email',
      password: 'password-hash',
      role: RoleEnum.ADMIN,
    });
    expect(newUser).toStrictEqual(mockUser);
    expect(passwordSpyFn).toHaveBeenCalledWith('password-hash');
    expect(saveSpyFn).toHaveBeenCalledTimes(1);

    expect(createSpyFn).toHaveBeenCalledWith({
      firstName: 'firstName',
      middleName: '',
      lastName: 'lastName',
      email: 'email',
      password: 'password-hash',
      role: RoleEnum.ADMIN,
    });
  });
});
