import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Source } from './entities/source.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserRole } from '../user/entities/user.enums';
import { PaginationService } from '../shared/pagination/pagination.service';
import { PaginationParams } from '../shared/pagination/paginataion.types';

@Injectable()
export class SourceService extends PaginationService {
  constructor(
    @InjectRepository(Source)
    private readonly sourceRepository: Repository<Source>,
  ) {
    super();
  }
  create({ userId, dto }: { userId: string; dto: CreateSourceDto }) {
    return this.sourceRepository.save({
      ...dto,
      user: { id: userId },
    });
  }

  findAll({
    userId,
    role,
    filter,
  }: {
    userId: string;
    role: UserRole;
    filter: PaginationParams;
  }) {
    const where: FindOptionsWhere<Source> =
      role === UserRole.USER ? { user: { id: userId } } : {};
    return this.paginateResults(this.sourceRepository, where, filter);
  }

  find() {
    return this.sourceRepository.find();
  }

  async findOne({
    id,
    userId,
    role,
  }: {
    id: string;
    userId: string;
    role: UserRole;
  }) {
    const where: FindOptionsWhere<Source> =
      role === UserRole.USER ? { user: { id: userId }, id } : { id };
    const source = await this.sourceRepository.findOne({
      where,
    });
    if (!source) {
      throw new NotFoundException('Source not found');
    }
    return source;
  }

  one(id: string) {
    return this.sourceRepository.findOne({ where: { id } });
  }

  async update({
    id,
    userId,
    role,
    dto,
  }: {
    id: string;
    userId: string;
    role: UserRole;
    dto: UpdateSourceDto;
  }) {
    const where: FindOptionsWhere<Source> =
      role === UserRole.USER ? { user: { id: userId }, id } : { id };
    const existing = await this.sourceRepository.findOne({
      where,
    });
    if (!existing) {
      throw new NotFoundException('Source not found');
    }
    await this.sourceRepository.update({ id }, dto);
    return this.sourceRepository.findOne({
      where,
    });
  }

  async remove({
    id,
    userId,
    role,
  }: {
    id: string;
    userId: string;
    role: UserRole;
  }) {
    const where: FindOptionsWhere<Source> =
      role === UserRole.USER ? { user: { id: userId }, id } : { id };
    const result = await this.sourceRepository.delete(where);
    return {
      message: result?.affected
        ? 'Source deleted successfully'
        : 'Source not found',
    };
  }
}
