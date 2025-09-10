import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { SessionGuard } from '../auth/guards/session.guard';
import { AuthSession } from '../auth/auth.types';

@UseGuards(SessionGuard)
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(
    @Body() dto: CreateEventDto,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.eventService.create({ userId, dto });
  }

  @Get()
  findAll(@Session() { user: { id: userId, role } }: AuthSession) {
    return this.eventService.findAll({ userId });
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.eventService.findOne({ id, userId });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.eventService.update({ id, userId, dto });
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.eventService.remove({ id, userId });
  }
}
