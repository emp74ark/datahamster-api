import { Injectable, NotFoundException } from '@nestjs/common';
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
  create({ userId, dto }: { userId: string; dto: CreateEventDto }) {
    return this.eventRepository.save({
      ...dto,
      user: { id: userId },
      action: { id: dto.actionId },
    });
  }

  findAll({ userId }: { userId: string }) {
    return this.eventRepository.find({ where: { user: { id: userId } } });
  }

  async findOne({ id, userId }: { id: string; userId: string }) {
    const event = await this.eventRepository.findOne({
      where: { id },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
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
    const event = await this.eventRepository.findOne({
      where: { id },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    const payload: Omit<UpdateEventDto, 'user' | 'action'> = {
      ...dto,
    };
    await this.eventRepository.update(event.id, payload);
    return this.eventRepository.findOneBy({ id });
  }

  async remove({ id, userId }: { id: string; userId: string }) {
    const result = await this.eventRepository.delete(id);
    return {
      message: result?.affected
        ? 'Event deleted successfully'
        : 'Event not found',
    };
  }
}
