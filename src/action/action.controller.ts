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
import { Pagination } from '../shared/pagination/pagination.decorator';
import { PaginationParams } from '../shared/pagination/paginataion.types';

@UseGuards(SessionGuard)
@Controller('action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Post()
  create(
    @Body() dto: CreateActionDto,
    @Session() { user: { id: userId } }: AuthSession,
  ) {
    return this.actionService.create({ userId, dto });
  }

  @Get()
  findAll(
    @Session() { user: { id: userId, role } }: AuthSession,
    @Pagination() filter: PaginationParams,
  ) {
    return this.actionService.findAll({ userId, role, filter });
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.actionService.findOne({ id, userId, role });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateActionDto,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.actionService.update({ id, userId, role, dto });
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.actionService.remove({ id, userId, role });
  }
}
