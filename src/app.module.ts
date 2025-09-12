import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { ActionModule } from './action/action.module';
import { EventModule } from './event/event.module';
import { SourceModule } from './source/source.module';
import { User } from './user/entities/user.entity';
import { Source } from './source/entities/source.entity';
import { Action } from './action/entities/action.entity';
import { Event } from './event/entities/event.entity';
import { PublicModule } from './public/public.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Source, Action, Event],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    SharedModule,
    AuthModule,
    ActionModule,
    EventModule,
    SourceModule,
    PublicModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
