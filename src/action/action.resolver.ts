import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ActionService } from './action.service';
import { Action, PaginatedActions } from './entities/action.entity';
import { SkipThrottle } from '@nestjs/throttler';
import { DeleteSourceResponse, Source } from '../source/entities/source.entity';
import { UseGuards } from '@nestjs/common';
import { SessionGuard } from '../auth/guards/session.guard';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { User } from '../user/entities/user.entity';
import { PaginationInput } from '../shared/pagination/pagination.input';
import { UserRole } from '../user/entities/user.enums';
import { CreateActionDto } from './dto/create-action.dto';
import { ChangeActionDto } from './dto/update-action.dto';

@Resolver(() => Action)
@SkipThrottle()
@UseGuards(SessionGuard)
export class ActionResolver {
  constructor(private readonly actionService: ActionService) {}

  @Query(() => PaginatedActions)
  async actions(
    @Args('sourceId', { nullable: true }) sourceId: string,
    @Args('pagination')
    pagination: PaginationInput,
    @ActiveUser() user: User,
  ) {
    return this.actionService.findAll({
      userId: user.id,
      role: UserRole.USER, // show only actions of the user
      sourceId,
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

  @Mutation(() => Action)
  createAction(@Args('dto') dto: CreateActionDto, @ActiveUser() user: User) {
    return this.actionService.create({ userId: user.id, dto });
  }

  @Mutation(() => DeleteSourceResponse)
  deleteAction(@Args('id') id: string, @ActiveUser() user: User) {
    return this.actionService.remove({ userId: user.id, id, role: user.role });
  }

  @Mutation(() => Action)
  updateAction(@Args('dto') dto: ChangeActionDto, @ActiveUser() user: User) {
    const { id, ...rest } = dto;
    return this.actionService.update({
      id,
      userId: user.id,
      role: user.role,
      dto: rest,
    });
  }
}
