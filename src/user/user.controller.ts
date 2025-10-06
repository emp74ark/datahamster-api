import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SessionGuard } from '../auth/guards/session.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { RequiredRole } from '../auth/decorators/role.decorator';
import { UserRole } from './entities/user.enums';
import { AuthSession } from '../auth/auth.types';

@UseGuards(SessionGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(RoleGuard)
  @RequiredRole(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create({ dto });
  }

  @UseGuards(RoleGuard)
  @RequiredRole(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.userService.findOne({ id, userId, role });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.userService.update({ id, dto, userId, role });
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Session() { user: { id: userId, role } }: AuthSession,
  ) {
    return this.userService.remove({ id, userId, role });
  }
}
