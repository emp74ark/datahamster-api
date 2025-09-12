import { Injectable } from '@nestjs/common';
import { CreatePublicDto } from './dto/create-public.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Action } from '../action/entities/action.entity';
import { Event } from '../event/entities/event.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PublicService {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}
  async create({ dto: { id, localTime, ip, data } }: { dto: CreatePublicDto }) {
    const existingAction = await this.actionRepository.findOne({
      where: {
        publicId: id,
      },
      relations: { user: true },
    });
    if (existingAction) {
      await this.eventRepository.save({
        user: { id: existingAction.user.id },
        action: { id: existingAction.id },
        localTime,
        ip,
        data,
      });
    }
    return { message: 'Ok' };
  }
}
