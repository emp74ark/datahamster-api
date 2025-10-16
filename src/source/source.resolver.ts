import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SourceService } from './source.service';
import { SkipThrottle } from '@nestjs/throttler';
import {
  DeleteSourceResponse,
  PaginatedSources,
  Source,
} from './entities/source.entity';
import { UseGuards } from '@nestjs/common';
import { SessionGuard } from '../auth/guards/session.guard';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { User } from '../user/entities/user.entity';
import { PaginationInput } from '../shared/pagination/pagination.input';
import { UserRole } from '../user/entities/user.enums';
import { CreateSourceDto } from './dto/create-source.dto';
import { ChangeSourceDto } from './dto/update-source.dto';

@Resolver(() => Source)
@SkipThrottle()
@UseGuards(SessionGuard)
export class SourceResolver {
  constructor(private readonly sourceService: SourceService) {}

  @Query(() => PaginatedSources)
  async sources(
    @Args('pagination')
    pagination: PaginationInput,
    @ActiveUser() user: User,
  ) {
    return this.sourceService.findAll({
      userId: user.id,
      role: UserRole.USER, // show only sources of the user
      filter: {
        ...pagination,
      },
    });
  }

  @Query(() => Source)
  source(@Args('id') id: string, @ActiveUser() user: User) {
    return this.sourceService.findOne({ id, userId: user.id, role: user.role });
  }

  @Mutation(() => Source)
  createSource(@Args('dto') dto: CreateSourceDto, @ActiveUser() user: User) {
    return this.sourceService.create({ userId: user.id, dto });
  }

  @Mutation(() => DeleteSourceResponse)
  deleteSource(@Args('id') id: string, @ActiveUser() user: User) {
    return this.sourceService.remove({ id, userId: user.id, role: user.role });
  }

  @Mutation(() => Source)
  updateSource(@Args('dto') dto: ChangeSourceDto, @ActiveUser() user: User) {
    const { id, ...rest } = dto;
    return this.sourceService.update({
      id,
      userId: user.id,
      role: user.role,
      dto: rest,
    });
  }
}
