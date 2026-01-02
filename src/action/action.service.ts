import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Action } from './entities/action.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserRole } from '../user/entities/user.enums';
import { PaginationParams } from '../shared/pagination/paginataion.types';
import { PaginationService } from '../shared/pagination/pagination.service';

@Injectable()
export class ActionService extends PaginationService {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,
  ) {
    super();
  }
  create({ userId, dto }: { userId: string; dto: CreateActionDto }) {
    return this.actionRepository.save({
      ...dto,
      user: { id: userId },
      source: { id: dto.sourceId },
    });
  }

  findAll({
    userId,
    role,
    sourceId,
    filter,
  }: {
    userId: string;
    role: UserRole;
    sourceId?: string;
    filter: PaginationParams;
  }) {
    const where: FindOptionsWhere<Action> =
      role === UserRole.USER ? { user: { id: userId } } : {};
    if (sourceId) {
      where.source = { id: sourceId };
    }
    return this.paginateResults(this.actionRepository, where, filter);
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
    const where: FindOptionsWhere<Action> =
      role === UserRole.USER ? { user: { id: userId }, id } : { id };
    const action = await this.actionRepository.findOne({
      where,
      relations: { events: true },
    });
    if (!action) {
      throw new NotFoundException('Action not found');
    }
    return action;
  }

  async update({
    id,
    dto,
    userId,
    role,
  }: {
    id: string;
    dto: UpdateActionDto;
    userId: string;
    role: UserRole;
  }) {
    const where: FindOptionsWhere<Action> =
      role === UserRole.USER ? { user: { id: userId }, id } : { id };
    const existing = await this.actionRepository.findOne({
      where,
    });
    if (!existing) {
      throw new NotFoundException('Action not found');
    }
    const payload = <Omit<UpdateActionDto, 'user'>>{ ...dto };
    await this.actionRepository.update({ id }, payload);
    return this.actionRepository.findOne({ where });
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
    const where: FindOptionsWhere<Action> =
      role === UserRole.USER ? { user: { id: userId }, id } : { id };
    const result = await this.actionRepository.delete(where);
    return {
      message: result?.affected
        ? 'Action deleted successfully'
        : 'Action not found',
    };
  }
}
