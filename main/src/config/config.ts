import { ConfigProps } from 'src/interfaces/config.interface';

export const config = (): ConfigProps => ({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3030,
  POSTGRES_HOST: process.env.DB_HOST || 'localhost',
  POSTGRES_PORT: Number(process.env.DB_PORT) || 5432,
  POSTGRES_USER: process.env.DB_USERNAME || 'postgres',
  POSTGRES_PASSWORD: process.env.DB_PASSWORD || 'postgres',
  POSTGRES_DB: process.env.DB_DATABASE || 'test_db',
  JWT_SECRET: process.env.JWT_SECRET || 'SECRETE',
  JWT_EXPIRE_IN: process.env.JWT_EXPIRE || '1h',
  UPLOAD_PATH: process.env.UPLOAD_PATH || 'uploads',
  UPLOAD_MAX_SIZE:process.env.UPLOAD_MAX_FILE_SIZE ? parseInt(process.env.UPLOAD_MAX_FILE_SIZE) : 1048576,
  userServiceHost: process.env.INGESTION_SERVICE_HOST || 'localhost',
  userServicePort: process.env.INGESTION_SERVICE_PORT ? parseInt(process.env.INGESTION_SERVICE_PORT) : 3001,
});
