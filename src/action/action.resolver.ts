import { Query, Resolver } from '@nestjs/graphql';
import { ActionService } from './action.service';
import { Action } from './entities/action.entity';
import { SkipThrottle } from '@nestjs/throttler';

@Resolver()
@SkipThrottle()
export class ActionResolver {
  constructor(private readonly actionService: ActionService) {}

  @Query(() => [Action])
  actions() {
    return this.actionService.find();
  }
}
