import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Action } from './entities/action.entity';
import { Repository } from 'typeorm';

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

  findAll({ userId }: { userId: string }) {
    return this.actionRepository.find({ where: { user: { id: userId } } });
  }

  async findOne({ id, userId }: { id: string; userId: string }) {
    const action = await this.actionRepository.findOne({
      where: { id },
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
  }: {
    id: string;
    dto: UpdateActionDto;
    userId: string;
  }) {
    const action = await this.actionRepository.findOne({
      where: { id },
    });
    if (!action) {
      throw new NotFoundException('Action not found');
    }
    const payload = <Omit<UpdateActionDto, 'user'>>{ ...dto };
    await this.actionRepository.update(id, payload);
    return this.actionRepository.findOneBy({ id });
  }

  async remove({ id, userId }: { id: string; userId: string }) {
    const action = await this.actionRepository.findOne({
      where: { id },
    });
    if (!action) {
      throw new NotFoundException('Action not found');
    }
    return this.actionRepository.delete(action);
  }
}
