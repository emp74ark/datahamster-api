import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create({ dto }: { dto: CreateUserDto }) {
    const hash = await argon.hash(dto.password);

    const existingUser = await this.userRepository.findOneBy({
      username: dto.username,
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const created = await this.userRepository.save({
      ...dto,
      password: hash,
    });

    if (!created) {
      throw new InternalServerErrorException('User not created');
    }

    return this.userRepository.findOneBy({ id: created.id });
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne({ id }: { id: number }) {
    return this.userRepository.findOneBy({ id });
  }

  async update({ id, dto }: { id: number; dto: UpdateUserDto }) {
    const payload: Partial<User> = { ...dto };
    if (dto.password) {
      payload.password = await argon.hash(dto.password);
    }
    await this.userRepository.update(id, payload);
    return this.userRepository.findOneBy({ id });
  }

  remove({ id }: { id: number }) {
    return this.userRepository.delete(id);
  }
}
