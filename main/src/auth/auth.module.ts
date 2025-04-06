import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtNestService } from './jwt.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/auth.jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRE_IN') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtNestService,JwtStrategy],
})
export class AuthModule {}
