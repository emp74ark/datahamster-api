import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import { Pool } from 'pg';
import * as connectPgSimple from 'connect-pg-simple';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('PORT') || 3700;

  const TTL = 1000 * 60 * 60 * 24;

  const DB_CONFIG = {
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    user: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
  };

  const pgPool = new Pool(DB_CONFIG);
  const PgSessionStore = connectPgSimple(session);
  const sessionStore = new PgSessionStore({
    pool: pgPool,
    tableName: 'session',
    createTableIfMissing: true,
  });

  app.use(
    session({
      secret: configService.get<string>('AUTH_SECRET') || 'secret',
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        maxAge: TTL,
      },
      name: configService.get<string>('COOKIE_NAME') || 'datahamster.id',
    }),
  );

  app.use(helmet());

  app.enableCors({
    origin: [configService.get<string>('WEB_CLIENT')],
    credentials: true,
  });

  await app.listen(PORT);
}
bootstrap();
