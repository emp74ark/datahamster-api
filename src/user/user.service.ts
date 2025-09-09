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
  async create(createUserDto: CreateUserDto) {
    const hash = await argon.hash(createUserDto.password);

    const existingUser = await this.userRepository.findOneBy({
      login: createUserDto.login,
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const created = await this.userRepository.save({
      ...createUserDto,
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

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const payload: Partial<User> = { ...updateUserDto };
    if (updateUserDto.password) {
      payload.password = await argon.hash(updateUserDto.password);
    }
    await this.userRepository.update(id, payload);
    return this.userRepository.findOneBy({ id });
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
