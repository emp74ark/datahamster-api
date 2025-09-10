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

    Reflect.deleteProperty(created, 'password');

    return this.userRepository.findOneBy({ id: created.id });
  }

  findAll() {
    return this.userRepository.find({
      select: ['id', 'username', 'email', 'role'],
    });
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
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (role === UserRole.USER && id !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    Reflect.deleteProperty(user, 'password');
    return user;
  }

  async update({
    id,
    dto,
    userId,
    role,
  }: {
    id: string;
    dto: UpdateUserDto;
    userId: string;
    role: UserRole;
  }) {
    const existing = await this.userRepository.findOneBy({ id });
    if (!existing) {
      throw new BadRequestException('User not found');
    }
    if (role === UserRole.USER && id !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }
    const payload: Omit<Partial<User>, 'sources' | 'actions' | 'events'> = {
      ...dto,
    };
    Reflect.deleteProperty(payload, 'role');
    if (dto.password) {
      payload.password = await argon.hash(dto.password);
    }
    await this.userRepository.update(id, payload);
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new InternalServerErrorException('User update failedL');
    }
    Reflect.deleteProperty(user, 'password');
    return user;
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
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (role === UserRole.USER && id !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.userRepository.delete(id);
  }
}
