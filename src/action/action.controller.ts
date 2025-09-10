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
import { ActionService } from './action.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { SessionGuard } from '../auth/guards/session.guard';
import { AuthSession } from '../auth/auth.types';

@UseGuards(SessionGuard)
@Controller('action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Post()
  create(
    @Body() dto: CreateActionDto,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.actionService.create({ userId, dto });
  }

  @Get()
  findAll(@Session() { user: { id: userId, role } }: AuthSession) {
    return this.actionService.findAll({ userId });
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.actionService.findOne({ id, userId });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateActionDto,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.actionService.update({ id, userId, dto });
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.actionService.remove({ id, userId });
  }
}
