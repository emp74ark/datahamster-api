import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ActionService } from './action.service';
import { Action, PaginatedActions } from './entities/action.entity';
import { SkipThrottle } from '@nestjs/throttler';
import { Source } from '../source/entities/source.entity';
import { UseGuards } from '@nestjs/common';
import { SessionGuard } from '../auth/guards/session.guard';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { User } from '../user/entities/user.entity';
import { PaginationInput } from '../shared/pagination/pagination.input';

@Resolver(() => Action)
@SkipThrottle()
@UseGuards(SessionGuard)
export class ActionResolver {
  constructor(private readonly actionService: ActionService) {}

  @Query(() => PaginatedActions)
  async actions(
    @Args('pagination')
    pagination: PaginationInput,
    @ActiveUser() user: User,
  ) {
    return this.actionService.findAll({
      userId: user.id,
      role: user.role,
      filter: {
        ...pagination,
      },
    });
  }

  @Query(() => Action)
  action(@Args('id') id: string, @ActiveUser() user: User) {
    return this.actionService.findOne({ id, userId: user.id, role: user.role });
  }

  @ResolveField(() => [Action], { name: 'actions' })
  async actionsFromParent(@Parent() source: Source, @ActiveUser() user: User) {
    const { results } = await this.actionService.findAll({
      sourceId: source.id,
      userId: user.id,
      role: user.role,
      filter: {},
    });
    return results;
  }
}
