import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Events')
@UseGuards(SessionGuard)
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiOperation({ summary: 'Create an event' })
  @Post()
  create(
    @Body() dto: CreateEventDto,
    @Session() { user: { id: userId } }: AuthSession,
  ) {
    return this.eventService.create({ userId, dto });
  }

  @ApiOperation({ summary: 'Get all events' })
  @Get()
  findAll(
    @Session() { user: { id: userId, role } }: AuthSession,
    @Query('actionId') actionId: string | undefined,
    @Pagination() paginationParams: PaginationParams,
  ) {
    return this.eventService.findAll({
      userId,
      role,
      filter: { ...paginationParams, actionId },
    });
  }

  @ApiOperation({ summary: 'Get an event by id' })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.eventService.findOne({ id, userId, role });
  }

  @ApiOperation({ summary: 'Update an event' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.eventService.update({ id, userId, role, dto });
  }

  @ApiOperation({ summary: 'Delete an event' })
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.eventService.remove({ id, userId, role });
  }
}
