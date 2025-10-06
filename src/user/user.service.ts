import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { UserRole } from './entities/user.enums';
import { userPublicFields } from './entities/user.constants';

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

    const { id } = await this.userRepository.save({
      ...dto,
      password: hash,
    });

    if (!id) {
      throw new InternalServerErrorException('User not created');
    }

    return this.userRepository.findOne({
      where: { id },
      select: userPublicFields,
    });
  }

  findAll() {
    return this.userRepository.find({
      select: userPublicFields,
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
    const user = await this.userRepository.findOne({
      where: { id },
      select: userPublicFields,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (role === UserRole.USER && id !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }
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
      throw new NotFoundException('User not found');
    }
    if (role === UserRole.USER && id !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }
    const payload: Omit<Partial<User>, 'role'> = { ...dto };
    if (dto.password) {
      payload.password = await argon.hash(dto.password);
    }
    await this.userRepository.update(id, payload);
    return this.userRepository.findOne({
      where: { id },
      select: userPublicFields,
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
    if (role === UserRole.USER && id !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }
    const result = await this.userRepository.delete(id);
    return {
      message: result?.affected
        ? 'User deleted successfully'
        : 'User not found',
    };
  }
}
