import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { UserRole } from './entities/user.enums';

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

  async findOne({ id, userId }: { id: number; userId: number }) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user?.role === UserRole.USER && id !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }
    return user;
  }

  async update({
    id,
    dto,
    userId,
  }: {
    id: number;
    dto: UpdateUserDto;
    userId: number;
  }) {
    const existing = await this.userRepository.findOneBy({ id });
    if (!existing) {
      throw new BadRequestException('User not found');
    }
    if ((existing?.role === UserRole.USER && id) !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }
    const payload: Partial<User> = { ...dto };
    if (dto.password) {
      payload.password = await argon.hash(dto.password);
    }
    await this.userRepository.update(id, payload);
    return this.userRepository.findOneBy({ id });
  }

  async remove({ id, userId }: { id: number; userId: number }) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if ((user?.role === UserRole.USER && id) !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.userRepository.delete(id);
  }
}
