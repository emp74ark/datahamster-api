import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { SkipThrottle } from '@nestjs/throttler';
import { EventService } from './event.service';
import { Event } from './entities/event.entity';
import { Action } from '../action/entities/action.entity';
import { UseGuards } from '@nestjs/common';
import { SessionGuard } from '../auth/guards/session.guard';

@Resolver(() => Event)
@SkipThrottle()
@UseGuards(SessionGuard)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}
  @Query(() => [Event])
  events() {
    return this.eventService.find({});
  }

  @Query(() => Event)
  event(id: string) {
    return this.eventService.one({ id });
  }

  @ResolveField(() => [Event], { name: 'events' })
  eventsFromParent(@Parent() action: Action) {
    return this.eventService.find({ actionId: action.id });
  }
}
