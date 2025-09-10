import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}
  create({ dto }: { dto: CreateEventDto }) {
    return this.eventRepository.save(dto);
  }

  findAll({ userId }: { userId: string }) {
    return this.eventRepository.find({ where: { user: { id: userId } } });
  }

  async findOne({ id, userId }: { id: string; userId: string }) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    if (event.user.id !== userId) {
      throw new BadRequestException('Unauthorized');
    }
    return event;
  }

  async update({
    id,
    userId,
    dto,
  }: {
    id: string;
    userId: string;
    dto: UpdateEventDto;
  }) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    if (event.user.id !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    const payload: Omit<UpdateEventDto, 'user' | 'action'> = {
      ...dto,
    };
    return this.eventRepository.update(event.id, payload);
  }

  async remove({ id, userId }: { id: string; userId: string }) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    if (event.user.id !== userId) {
      throw new BadRequestException('Unauthorized');
    }
    return this.eventRepository.remove(event);
  }
}
