import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Source } from './entities/source.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SourceService {
  constructor(
    @InjectRepository(Source)
    private readonly sourceRepository: Repository<Source>,
  ) {}
  create({ dto }: { dto: CreateSourceDto }) {
    return this.sourceRepository.save(dto);
  }

  findAll({ userId }: { userId: string }) {
    return this.sourceRepository.find({ where: { user: { id: userId } } });
  }

  async findOne({ id, userId }: { id: string; userId: string }) {
    const source = await this.sourceRepository.findOneBy({ id });
    if (!source) {
      throw new NotFoundException('Source not found');
    }
    if (source.user.id !== userId) {
      throw new NotFoundException('Unauthorized');
    }
    return source;
  }

  async update({
    id,
    userId,
    dto,
  }: {
    id: string;
    userId: string;
    dto: UpdateSourceDto;
  }) {
    const source = await this.sourceRepository.findOneBy({ id });
    if (!source) {
      throw new NotFoundException('Source not found');
    }
    if (source.user.id !== userId) {
      throw new NotFoundException('Unauthorized');
    }
    return this.sourceRepository.update({ id }, dto);
  }

  async remove({ id, userId }: { id: string; userId: string }) {
    const source = await this.sourceRepository.findOneBy({ id });
    if (!source) {
      throw new NotFoundException('Source not found');
    }
    if (source.user.id !== userId) {
      throw new NotFoundException('Unauthorized');
    }
    return this.sourceRepository.delete({ id });
  }
}
