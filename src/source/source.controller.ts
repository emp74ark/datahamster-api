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
import { SourceService } from './source.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { SessionGuard } from '../auth/guards/session.guard';
import { AuthSession } from '../auth/auth.types';
import { Pagination } from '../shared/pagination/pagination.decorator';
import { PaginationParams } from '../shared/pagination/paginataion.types';

@UseGuards(SessionGuard)
@Controller('source')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Post()
  create(
    @Body() dto: CreateSourceDto,
    @Session() { user: { id: userId } }: AuthSession,
  ) {
    return this.sourceService.create({ userId, dto });
  }

  @Get()
  findAll(
    @Session() { user: { id: userId, role } }: AuthSession,
    @Pagination() filter: PaginationParams,
  ) {
    return this.sourceService.findAll({ userId, role, filter });
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.sourceService.findOne({ id, userId, role });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSourceDto,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.sourceService.update({ id, userId, role, dto });
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.sourceService.remove({ id, userId, role });
  }
}
