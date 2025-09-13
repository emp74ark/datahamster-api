import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { PaginationParams } from './paginataion.types';

export class PaginationService {
  protected async paginateResults<T extends object>(
    repository: Repository<T>,
    where: FindOptionsWhere<T>,
    filter: PaginationParams,
  ) {
    const skip = filter.pageNumber * filter.perPage - filter.perPage;
    const take = filter.perPage;
    const sortBy = filter.sortBy;
    const sortOrder = filter.sortOrder;
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
