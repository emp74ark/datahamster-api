import { Body, Controller, Post } from '@nestjs/common';
import { PublicService } from './public.service';
import { CreatePublicDto } from './dto/create-public.dto';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Post()
  create(@Body() dto: CreatePublicDto) {
    return this.publicService.create({ dto });
  }
}
