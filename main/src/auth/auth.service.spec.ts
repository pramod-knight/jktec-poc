import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtNestService } from './jwt.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PasswordService } from '../users/password.service';
import { JwtStrategy } from './strategy/auth.jwt.strategy';
import { PassportModule } from '@nestjs/passport';
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
  role: RoleEnum.ADMIN,
};


describe('AuthService', () => {
  let service: AuthService;

  let userService: UsersService;
  let jwtService: JwtNestService;

  // Mock JwtService
  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };
  const mockConfigService = {
    get: jest.fn().mockReturnValue('JWT_SECRET'),  // mock secret return value
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtNestService,
        UsersService,
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
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtNestService>(JwtNestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('registration process', () => {
    /**Check duplicate entry */
    it('should check for user email exist', async () => {
      const existSpy = jest
        .spyOn(userService, 'isUserExist')
        .mockResolvedValue(mockUser);

      const createSpy = jest.spyOn(userService, 'create');

      try {
        await service.registerNewUser({
          firstName: 'firstName',
          middleName: '',
          lastName: 'lastName',
          email: 'email',
          password: 'password',
          role: RoleEnum.ADMIN,
        });
      } catch (e) {
        expect(e.message).toBe(`User email is already exist`);
      }
      expect(existSpy).toHaveBeenCalledWith('email');
      expect(createSpy).toHaveBeenCalledTimes(0);
    });

    /**Create new user and get Token */
    it("should create new user and return access token", async () => {
      const dto = {
        email: "email",
        password: "password",
        lastName: "lName",
        firstName: "fName",
        middleName:"",
        role: RoleEnum.ADMIN,
      };

      const existSpy = jest
        .spyOn(userService, 'isUserExist')
        .mockResolvedValue(null);

      const createSpy = jest.spyOn(userService, "create").mockResolvedValue({ ...mockUser, ...dto });

      const userTokenSpy = jest.spyOn(mockJwtService, "sign").mockReturnValue("mock-token");

      const newUser = await service.registerNewUser(dto);

      expect(newUser).toHaveProperty(["accessToken"]);
  
      expect(existSpy).toHaveBeenCalledWith("email");
      expect(createSpy).toHaveBeenCalledWith(dto);
      expect(userTokenSpy).toHaveBeenCalledWith(expect.objectContaining({"name": "fName", "sub": "uuid","role": "admin",}));
    });
  });

  describe('Login process', () => {
    
    it('check invalid username and password',async()=>{

      let payload={
        email:"email",
        password:"password"
      };
      let spyOnValidateUser = jest.spyOn(userService,"validateLogin").mockResolvedValue({status:false,user:null,message:"Invalid credentials"});

      try {
        await service.login(payload)
      } catch (e) {
        expect(e.message).toBe("Invalid credentials");
      }
      expect(spyOnValidateUser).toHaveBeenCalledWith("email", "password");

    });

    it("should return access token", async () => {
      const dto = {
        email: "email",
        password: "password",
      };

      const createSpy = jest.spyOn(userService, "validateLogin").mockResolvedValue({status:true,user:mockUser,message:"User is valid"});

      const userTokenSpy = jest.spyOn(mockJwtService, "sign").mockReturnValue("mock-token");

      const loginUser = await service.login(dto);

      expect(loginUser).toHaveProperty(["accessToken"]);
      expect(createSpy).toHaveBeenCalledWith("email", "password");
      expect(userTokenSpy).toHaveBeenCalledWith({"name": "firstName", "sub": "uuid","role": "admin"});
    });
  });
});
