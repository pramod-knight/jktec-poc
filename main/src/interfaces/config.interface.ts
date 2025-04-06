export interface ConfigProps {
  port: number;
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  JWT_SECRET: string;
  JWT_EXPIRE_IN: string;
  UPLOAD_PATH:string;
  UPLOAD_MAX_SIZE:number;
  userServiceHost: string;
  userServicePort:number
}
