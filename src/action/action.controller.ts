import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ActionService } from './action.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { SessionUserId } from '../auth/decorators/session-user.decorator';
import { SessionGuard } from '../auth/guards/session.guard';

@UseGuards(SessionGuard)
@Controller('action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Post()
  create(@Body() dto: CreateActionDto, @SessionUserId() userId: string) {
    return this.actionService.create({ userId, dto });
  }

  @Get()
  findAll(@SessionUserId() userId: string) {
    return this.actionService.findAll({ userId });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @SessionUserId() userId: string) {
    return this.actionService.findOne({ id, userId });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateActionDto,
    @SessionUserId() userId: string,
  ) {
    return this.actionService.update({ id, userId, dto });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @SessionUserId() userId: string) {
    return this.actionService.remove({ id, userId });
  }
}
