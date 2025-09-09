import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
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
import { SessionRole } from '../auth/decorators/session-role.decorator';

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
    @Param('id', ParseIntPipe) id: number,
    @SessionUserId() userId: number,
    @SessionRole() role: UserRole,
  ) {
    console.log(userId);
    return this.userService.findOne({ id, userId, role });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @SessionUserId() userId: number,
    @SessionRole() role: UserRole,
  ) {
    return this.userService.update({ id, dto, userId, role });
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @SessionUserId() userId: number,
    @SessionRole() role: UserRole,
  ) {
    return this.userService.remove({ id, userId, role });
  }
}
