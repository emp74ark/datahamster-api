import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from '../action/entities/action.entity';
import { Event } from '../event/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Action, Event])],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
