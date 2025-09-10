import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  create({ userId, dto }: { userId: string; dto: CreateEventDto }) {
    return 'This action adds a new event';
  }

  findAll({ userId }: { userId: string }) {
    return `This action returns all event`;
  }

  findOne({ id, userId }: { id: string; userId: string }) {
    return `This action returns a #${id} event`;
  }

  update({
    id,
    userId,
    dto,
  }: {
    id: string;
    userId: string;
    dto: UpdateEventDto;
  }) {
    return `This action updates a #${id} event`;
  }

  remove({ id, userId }: { id: string; userId: string }) {
    return `This action removes a #${id} event`;
  }
}
