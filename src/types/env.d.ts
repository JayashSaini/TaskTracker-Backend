// @types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    DB_HOST: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    ACCESSTOKEN_SECRET: string;
    ACCESSTOKEN_EXPIRY: string;
    CORS_ORIGIN: string;
  }
}
