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
import { Pagination } from '../shared/pagination/pagination.decorator';
import { PaginationParams } from '../shared/pagination/paginataion.types';

@UseGuards(SessionGuard)
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(
    @Body() dto: CreateEventDto,
    @Session() { user: { id: userId } }: AuthSession,
  ) {
    return this.eventService.create({ userId, dto });
  }

  @Get()
  findAll(
    @Session() { user: { id: userId, role } }: AuthSession,
    @Pagination() filter: PaginationParams,
  ) {
    return this.eventService.findAll({ userId, role, filter });
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.eventService.findOne({ id, userId, role });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.eventService.update({ id, userId, role, dto });
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.eventService.remove({ id, userId, role });
  }
}
