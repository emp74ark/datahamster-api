import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Action } from './entities/action.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserRole } from '../user/entities/user.enums';

@Injectable()
export class ActionService {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,
  ) {}
  create({ userId, dto }: { userId: string; dto: CreateActionDto }) {
    return this.actionRepository.save({
      ...dto,
      user: { id: userId },
      source: { id: dto.sourceId },
    });
  }

  findAll({ userId, role }: { userId: string; role: UserRole }) {
    const where: FindOptionsWhere<Action> =
      role === UserRole.USER ? { user: { id: userId } } : {};
    return this.actionRepository.find({ where });
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
    const action = await this.actionRepository.findOne({
      where,
    });
    if (!action) {
      throw new NotFoundException('Action not found');
    }
    const payload = <Omit<UpdateActionDto, 'user'>>{ ...dto };
    await this.actionRepository.update(id, payload);
    return this.actionRepository.findOneBy({ id });
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
