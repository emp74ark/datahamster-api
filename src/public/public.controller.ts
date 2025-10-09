import { Body, Controller, Post } from '@nestjs/common';
import { PublicService } from './public.service';
import { CreatePublicDto } from './dto/create-public.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Public')
@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @ApiOperation({ summary: 'Create an event by public ID' })
  @Post()
  create(@Body() dto: CreatePublicDto) {
    return this.publicService.create({ dto });
  }
}
