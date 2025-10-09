import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ActionService } from './action.service';
import { Action } from './entities/action.entity';
import { SkipThrottle } from '@nestjs/throttler';
import { Source } from '../source/entities/source.entity';

@Resolver(() => Action)
@SkipThrottle()
export class ActionResolver {
  constructor(private readonly actionService: ActionService) {}

  @Query(() => [Action])
  actions() {
    return this.actionService.find({});
  }

  @Query(() => Action)
  action(@Args('id') id: string) {
    return this.actionService.one(id);
  }

  @ResolveField(() => [Action], { name: 'actions' })
  actionsFromParent(@Parent() source: Source) {
    return this.actionService.find({ sourceId: source.id });
  }
}
