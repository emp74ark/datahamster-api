import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { SkipThrottle } from '@nestjs/throttler';
import { EventService } from './event.service';
import { Event, PaginatedEvents } from './entities/event.entity';
import { Action } from '../action/entities/action.entity';
import { UseGuards } from '@nestjs/common';
import { SessionGuard } from '../auth/guards/session.guard';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { User } from '../user/entities/user.entity';
import { PaginationInput } from '../shared/pagination/pagination.input';
import { UserRole } from '../user/entities/user.enums';

@Resolver(() => Event)
@SkipThrottle()
@UseGuards(SessionGuard)
@UseGuards(SessionGuard)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}
  @Query(() => PaginatedEvents)
  async events(
    @Args('actionId', { nullable: true }) actionId: string,
    @Args('pagination')
    pagination: PaginationInput,
    @ActiveUser() user: User,
  ) {
    return this.eventService.findAll({
      userId: user.id,
      role: UserRole.USER, // show only events of the user
      filter: {
        ...pagination,
        actionId,
      },
    });
  }

  @Query(() => Event)
  event(@Args('id') id: string, @ActiveUser() user: User) {
    return this.eventService.findOne({ id, userId: user.id, role: user.role });
  }

  @ResolveField(() => [Event], { name: 'events' })
  async eventsFromParent(@Parent() action: Action, @ActiveUser() user: User) {
    const { results } = await this.eventService.findAll({
      userId: user.id,
      role: user.role,
      actionId: action.id,
      filter: {},
    });
    return results;
  }
}
