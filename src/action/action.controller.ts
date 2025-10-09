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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Actions')
@UseGuards(SessionGuard)
@Controller('action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @ApiOperation({ summary: 'Create an action' })
  @Post()
  create(
    @Body() dto: CreateActionDto,
    @Session() { user: { id: userId } }: AuthSession,
  ) {
    return this.actionService.create({ userId, dto });
  }

  @ApiOperation({ summary: 'Get all actions' })
  @Get()
  findAll(
    @Session() { user: { id: userId, role } }: AuthSession,
    @Pagination() filter: PaginationParams,
  ) {
    return this.actionService.findAll({ userId, role, filter });
  }

  @ApiOperation({ summary: 'Get an action by id' })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.actionService.findOne({ id, userId, role });
  }

  @ApiOperation({ summary: 'Update an action' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateActionDto,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.actionService.update({ id, userId, role, dto });
  }

  @ApiOperation({ summary: 'Delete an action' })
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.actionService.remove({ id, userId, role });
  }
}
