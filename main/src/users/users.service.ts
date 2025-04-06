import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from './password.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  /**
   * Create a new user
   * @param CreateUserDto the payload to create a new user
   * @returns the created user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);

    /** Hash Password */
    const hashPass = await this.passwordService.generate(
      createUserDto.password,
    );
    newUser.password = hashPass;

    return this.usersRepository.save(newUser);
  }

  findAll() {
    return `This action returns all users`;
  }

  private findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  /**
   * Validate the login credentials
   * @param email User email address
   * @param password user password
   * @returns Boolean
   */
  async validateLogin(
    email: string,
    password: string,
  ): Promise<{ status: boolean; user: User | null; message: string }> {
    const userFound = await this.findOneByEmail(email);
    if (!userFound) {
      return {
        status: false,
        user: null,
        message: 'No such account exist',
      };
    }
    //compare password
    const isPassMatch = await this.passwordService.compare(
      password,
      userFound.password,
    );

    if (!isPassMatch) {
      return {
        status: false,
        user: null,
        message: 'Invalid credentials',
      };
    }

    return {
      status: true,
      user: userFound,
      message: 'User is valid',
    };
  }
  /**
   * This function is used to check user exist by taking email as parameter
   * @param email user's email address
   * @returns User Entity if exist else null
   */
  async isUserExist(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
}
