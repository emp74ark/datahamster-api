import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { SessionUserId } from '../auth/decorators/session-user.decorator';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() dto: CreateEventDto) {
    return this.eventService.create({ dto });
  }

  @Get()
  findAll(@SessionUserId() userId: string) {
    return this.eventService.findAll({ userId });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @SessionUserId() userId: string) {
    return this.eventService.findOne({ id, userId });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @SessionUserId() userId: string,
  ) {
    return this.eventService.update({ id, userId, dto });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @SessionUserId() userId: string) {
    return this.eventService.remove({ id, userId });
  }
}
