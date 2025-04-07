import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtNestService } from './jwt.service';
import { UsersService } from '../users/users.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { PasswordService } from '../users/password.service';
import { createMock } from '@golevelup/ts-jest';
import { JwtStrategy } from './strategy/auth.jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { RoleEnum } from '../enum/role.enum';
import { ClsModule } from 'nestjs-cls';
import { ThrottlerModule } from '@nestjs/throttler';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let userService: UsersService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('JWT_SECRET'),  // mock secret return value
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClsModule,
        ThrottlerModule.forRoot({
          throttlers: [
            {
              ttl: 60000, //take second (e.g., 60 seconds = 1 minute) 
              limit: 5, // max number of limits per ttl
            },
          ],
        }),],
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtNestService,
        UsersService,
        ConfigService,
        JwtService,
        PasswordService,
        JwtStrategy,
        PassportModule,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it("should register user", async () => {
   
    jest.spyOn(authService, "registerNewUser").mockResolvedValue({
      accessToken: "token",
    });

    expect(
      await controller.authSignup({
        firstName: "firstName",
        lastName: "lastName",
        email: "email",
        password: "p",
        middleName:"",
        role: RoleEnum.ADMIN,
      }),
    ).toStrictEqual({
      message: "user registered",
      status:1,
      accessToken:'token'
    });
  });

  it("should login user", async () => {
   
    jest.spyOn(authService, "login").mockResolvedValue({
      accessToken: "token",
    });

    expect(
      await controller.authLogin({
        email: "email",
        password: "p",
      }),
    ).toStrictEqual({
      message: "user logged in",
      status:1,
      accessToken:'token'
    });
  });
});
