import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthSession } from '../auth.types';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class SessionGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<{ session: AuthSession | undefined }>();

    if (!request) {
      // Assume that it might be a graphql query
      const gqlContext = GqlExecutionContext.create(context);
      const ctx = gqlContext.getContext<{ req: { session: AuthSession } }>();
      return !!ctx.req.session.user;
    }

    const { session } = request;
    return Boolean(session && session.user);
  }
}
