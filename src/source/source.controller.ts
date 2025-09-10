import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SourceService } from './source.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { SessionUserId } from '../auth/decorators/session-user.decorator';

@Controller('source')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Post()
  create(@Body() dto: CreateSourceDto) {
    return this.sourceService.create({ dto });
  }

  @Get()
  findAll(@SessionUserId() userId: string) {
    return this.sourceService.findAll({ userId });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @SessionUserId() userId: string) {
    return this.sourceService.findOne({ id, userId });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSourceDto,
    @SessionUserId() userId: string,
  ) {
    return this.sourceService.update({ id, userId, dto });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @SessionUserId() userId: string) {
    return this.sourceService.remove({ id, userId });
  }
}
