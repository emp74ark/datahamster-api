import { Args, Query, Resolver } from '@nestjs/graphql';
import { SourceService } from './source.service';
import { SkipThrottle } from '@nestjs/throttler';
import { Source } from './entities/source.entity';

@Resolver(() => Source)
@SkipThrottle()
export class SourceResolver {
  constructor(private readonly sourceService: SourceService) {}

  @Query(() => [Source])
  sources() {
    return this.sourceService.find();
  }

  @Query(() => Source)
  source(@Args('id') id: string) {
    return this.sourceService.one(id);
  }
}
