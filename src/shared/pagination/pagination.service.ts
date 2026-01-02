import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Paginated, PaginationParams, SortOrder } from './paginataion.types';

export class PaginationService {
  protected async paginateResults<T extends object>(
    repository: Repository<T>,
    where: FindOptionsWhere<T>,
    filter: PaginationParams,
  ): Promise<Paginated<T>> {
    const take = filter.perPage || 20;
    const pageNumber = filter.pageNumber || 1;
    const skip = pageNumber * take - take;
    const sortBy = filter.sortBy || 'createdAt';
    const sortOrder = filter.sortOrder || SortOrder.DESC;
    const order: FindManyOptions<T>['order'] = {};
    if (sortBy && sortOrder) {
      order[sortBy] = sortOrder;
    }
    const [results, total] = await repository.findAndCount({
      where,
      skip,
      take,
      order,
    });
    return { results, total };
  }
}
