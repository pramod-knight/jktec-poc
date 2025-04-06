import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto, LoginDto } from './dto/create-auth.dto';
import { UsersService } from '../users/users.service';
import { Registration } from 'src/interfaces/registration.interface';
import { JwtNestService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtNestService,
  ) {}
  async registerNewUser(payload: SignupDto): Promise<Registration> {
    //check if email already exist
    const isExist = await this.userService.isUserExist(payload.email);
    if (isExist) {
      throw new BadRequestException(`User ${payload.email} is already exist`);
    }

    //create a new User
    const createdUser = await this.userService.create(payload);

    //create a token of user and return back
    const  authToken  = await this.jwtService.sign({
      sub: createdUser.id,
      name: createdUser.firstName,
      role: createdUser.role,
    });
    return {
      accessToken: authToken,
    };
  }

  async login(payload: LoginDto) {
    const validateUser = await this.userService.validateLogin(
      payload.email,
      payload.password,
    );
    if (!validateUser.status) {
      throw new UnauthorizedException(validateUser.message);
    }

    //create a token of user and return back
    const authToken = await this.jwtService.sign({
      sub: validateUser.user?.id,
      name: validateUser.user?.firstName,
      role: validateUser.user?.role,
    });
    return {
      accessToken: authToken,
    };
  }
}
