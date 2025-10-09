import { Query, Resolver } from '@nestjs/graphql';
import { SkipThrottle } from '@nestjs/throttler';
import { EventService } from './event.service';
import { Event } from './entities/event.entity';

@Resolver()
@SkipThrottle()
export class EventResolver {
  constructor(private readonly eventService: EventService) {}
  @Query(() => [Event])
  events() {
    return this.eventService.find();
  }
}
