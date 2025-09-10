import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserRole } from '../user/entities/user.enums';

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

  findAll({ userId, role }: { userId: string; role: UserRole }) {
    const where: FindOptionsWhere<Event> =
      role === UserRole.USER ? { user: { id: userId } } : {};
    return this.eventRepository.find({ where });
  }

  async findOne({
    id,
    userId,
    role,
  }: {
    id: string;
    userId: string;
    role: UserRole;
  }) {
    const where: FindOptionsWhere<Event> =
      role === UserRole.USER ? { user: { id: userId }, id } : { id };
    const event = await this.eventRepository.findOne({
      where,
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async update({
    id,
    userId,
    role,
    dto,
  }: {
    id: string;
    userId: string;
    role: UserRole;
    dto: UpdateEventDto;
  }) {
    const where: FindOptionsWhere<Event> =
      role === UserRole.USER ? { user: { id: userId }, id } : { id };
    const existing = await this.eventRepository.findOne({
      where,
    });
    if (!existing) {
      throw new NotFoundException('Event not found');
    }
    const payload: Omit<UpdateEventDto, 'user' | 'action'> = {
      ...dto,
    };
    await this.eventRepository.update({ id }, payload);
    return this.eventRepository.findOne({ where });
  }

  async remove({
    id,
    userId,
    role,
  }: {
    id: string;
    userId: string;
    role: UserRole;
  }) {
    const where: FindOptionsWhere<Event> =
      role === UserRole.USER ? { user: { id: userId }, id } : { id };
    const result = await this.eventRepository.delete(where);
    return {
      message: result?.affected
        ? 'Event deleted successfully'
        : 'Event not found',
    };
  }
}
