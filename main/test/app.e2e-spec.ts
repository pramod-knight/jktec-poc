import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST) Register new User', async () => {
    const createUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password',
    };
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(createUserDto)
      .expect(201)

      expect(response.body).toHaveProperty('accessToken');
  });

  it('/auth/login (POST) Login User', async () => {
    const loginDto = {
      email: 'john.doe@example.com',
      password: 'password',
    };
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)

      expect(response.body).toHaveProperty('accessToken');
  });

});
