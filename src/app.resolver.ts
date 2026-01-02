import { Query, Resolver } from '@nestjs/graphql';
import { SkipThrottle } from '@nestjs/throttler';

@Resolver()
@SkipThrottle()
export class AppResolver {
  @Query(() => String)
  health(): string {
    return 'Graphql works';
  }
}
