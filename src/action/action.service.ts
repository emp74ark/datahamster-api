import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  create({ dto }: { dto: CreateActionDto }) {
    return this.actionRepository.save(dto);
  }

  findAll({ userId }: { userId: string }) {
    return this.actionRepository.find({ where: { user: { id: userId } } });
  }

  async findOne({ id, userId }: { id: string; userId: string }) {
    const action = await this.actionRepository.findOneBy({ id });
    if (!action) {
      throw new NotFoundException('Action not found');
    }
    if (action.user.id !== userId) {
      throw new BadRequestException('Unauthorized');
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
    const action = await this.actionRepository.findOneBy({ id });
    if (!action) {
      throw new NotFoundException('Action not found');
    }
    if (action.user.id !== userId) {
      throw new BadRequestException('Unauthorized');
    }
    const payload = <Omit<UpdateActionDto, 'user'>>{ ...dto };
    return this.actionRepository.update(id, payload);
  }

  async remove({ id, userId }: { id: string; userId: string }) {
    const action = await this.actionRepository.findOneBy({ id });
    if (!action) {
      throw new NotFoundException('Action not found');
    }
    if (action.user.id !== userId) {
      throw new BadRequestException('Unauthorized');
    }
    return this.actionRepository.delete(id);
  }
}
