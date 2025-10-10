import { Args, Query, Resolver } from '@nestjs/graphql';
import { SourceService } from './source.service';
import { SkipThrottle } from '@nestjs/throttler';
import { Source } from './entities/source.entity';
import { UseGuards } from '@nestjs/common';
import { SessionGuard } from '../auth/guards/session.guard';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { User } from '../user/entities/user.entity';

@Resolver(() => Source)
@SkipThrottle()
@UseGuards(SessionGuard)
export class SourceResolver {
  constructor(private readonly sourceService: SourceService) {}

  @Query(() => [Source])
  async sources(@ActiveUser() user: User) {
    const sources = await this.sourceService.findAll({
      userId: user.id,
      role: user.role,
      filter: {},
    });
    return sources.results;
  }

  @Query(() => Source)
  source(@Args('id') id: string, @ActiveUser() user: User) {
    return this.sourceService.findOne({ id, userId: user.id, role: user.role });
  }
}
