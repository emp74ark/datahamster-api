import {
  BadRequestException,
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
import { userPublicFields } from '../user/entities/user.constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async login({ dto: { username, password } }: { dto: AuthLoginDto }) {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    console.debug('SERVICE_USER', user);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const pwdIsMatch = await argon.verify(user.password, password);
    console.debug('SERVICE_PWD_IS_MATCH', pwdIsMatch);

    if (!pwdIsMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    console.debug('SERVICE_UPDATE_LAST_LOGIN', user);
    const result = await this.userRepository.update(user.id, { lastLogin: new Date() });
    console.debug('SERVICE_UPDATE_LAST_LOGIN_RESULT', result);

    return this.userRepository.findOne({
      where: { username },
      select: userPublicFields,
    });
  }

  async signup({ dto }: { dto: AuthSignupDto }) {
    const existingUser = await this.userRepository.findOneBy({
      username: dto.username,
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hash = await argon.hash(dto.password);

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
}
