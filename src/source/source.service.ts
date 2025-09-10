import { Injectable } from '@nestjs/common';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';

@Injectable()
export class SourceService {
  create({ userId, dto }: { userId: string; dto: CreateSourceDto }) {
    return 'This action adds a new source';
  }

  findAll({ userId }: { userId: string }) {
    return `This action returns all source`;
  }

  findOne({ id, userId }: { id: string; userId: string }) {
    return `This action returns a #${id} source`;
  }

  update({
    id,
    userId,
    dto,
  }: {
    id: string;
    userId: string;
    dto: UpdateSourceDto;
  }) {
    return `This action updates a #${id} source`;
  }

  remove({ id, userId }: { id: string; userId: string }) {
    return `This action removes a #${id} source`;
  }
}
