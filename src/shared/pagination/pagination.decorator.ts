import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PaginationParams, SortOrder } from './paginataion.types';

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: { query: Partial<PaginationParams> } = ctx
      .switchToHttp()
      .getRequest();

    return {
      pageNumber: Number(request.query?.pageNumber) || 1,
      perPage: Number(request.query?.perPage) || 20,
      sortBy: request.query?.sortBy || 'createdAt',
      sortOrder: request.query?.sortOrder || SortOrder.DESC,
    };
  },
);
