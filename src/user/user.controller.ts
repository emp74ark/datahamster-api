import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SessionGuard } from '../auth/guards/session.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { RequiredRole } from '../auth/decorators/role.decorator';
import { UserRole } from './entities/user.enums';
import { SessionUserId } from '../auth/decorators/session-user.decorator';

@UseGuards(SessionGuard, RoleGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @RequiredRole(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create({ dto });
  }

  @RequiredRole(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @SessionUserId() userId: number,
  ) {
    return this.userService.findOne({ id, userId });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @SessionUserId() userId: number,
  ) {
    return this.userService.update({ id, dto, userId });
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @SessionUserId() userId: number,
  ) {
    return this.userService.remove({ id, userId });
  }
}
