import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import * as argon from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async login({ dto: { username, password } }: { dto: AuthLoginDto }) {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const pwdIsMatch = await argon.verify(user.password, password);

    if (!pwdIsMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const lastLogin = new Date();

    await this.userRepository.update(user.id, { lastLogin });

    Reflect.deleteProperty(user, 'password');

    return { ...user, lastLogin };
  }

  async signup({ dto }: { dto: AuthSignupDto }) {
    const existingUser = await this.userRepository.findOneBy({
      username: dto.username,
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hash = await argon.hash(dto.password);

    const user = await this.userRepository.save({
      ...dto,
      password: hash,
    });

    if (!user) {
      throw new InternalServerErrorException('User not created');
    }

    Reflect.deleteProperty(user, 'password');

    return user;
  }
}
