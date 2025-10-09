import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthSession } from '../auth.types';

export const ActiveUser = createParamDecorator(
  (_: unknown, executionContext: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(executionContext).getContext<{
      req: { session: AuthSession };
    }>();
    return ctx.req.session.user;
  },
);
