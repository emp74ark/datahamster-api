import { Injectable } from '@nestjs/common';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Injectable()
export class ActionService {
  create({ dto, userId }: { dto: CreateActionDto; userId: string }) {
    return 'This action adds a new action';
  }

  findAll({ userId }: { userId: string }) {
    return `This action returns all action`;
  }

  findOne({ id, userId }: { id: string; userId: string }) {
    return `This action returns a #${id} action`;
  }

  update({
    id,
    dto,
    userId,
  }: {
    id: string;
    dto: UpdateActionDto;
    userId: string;
  }) {
    return `This action updates a #${id} action`;
  }

  remove({ id, userId }: { id: string; userId: string }) {
    return `This action removes a #${id} action`;
  }
}
