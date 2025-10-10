import { Args, Query, Resolver } from '@nestjs/graphql';
import { SourceService } from './source.service';
import { SkipThrottle } from '@nestjs/throttler';
import { PaginatedSources, Source } from './entities/source.entity';
import { UseGuards } from '@nestjs/common';
import { SessionGuard } from '../auth/guards/session.guard';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { User } from '../user/entities/user.entity';
import { PaginationInput } from '../shared/pagination/pagination.input';

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
    console.log('pagination', pagination);
    return this.sourceService.findAll({
      userId: user.id,
      role: user.role,
      filter: {
        ...pagination,
      },
    });
  }

  @Query(() => Source)
  source(@Args('id') id: string, @ActiveUser() user: User) {
    return this.sourceService.findOne({ id, userId: user.id, role: user.role });
  }
}
