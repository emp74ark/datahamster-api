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
  create({ userId, dto }: { userId: string; dto: CreateSourceDto }) {
    return this.sourceRepository.save({
      ...dto,
      user: { id: userId },
    });
  }

  findAll({ userId }: { userId: string }) {
    return this.sourceRepository.find({
      where: { user: { id: userId } },
    });
  }

  async findOne({ id, userId }: { id: string; userId: string }) {
    const source = await this.sourceRepository.findOne({
      where: { id },
    });
    if (!source) {
      throw new NotFoundException('Source not found');
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
    const source = await this.sourceRepository.findOne({
      where: { id },
    });
    if (!source) {
      throw new NotFoundException('Source not found');
    }
    await this.sourceRepository.update({ id }, dto);
    return this.sourceRepository.findOne({
      where: { id },
    });
  }

  async remove({ id, userId }: { id: string; userId: string }) {
    const result = await this.sourceRepository.delete(id);
    return {
      message: result?.affected
        ? 'Source deleted successfully'
        : 'Source not found',
    };
  }
}
