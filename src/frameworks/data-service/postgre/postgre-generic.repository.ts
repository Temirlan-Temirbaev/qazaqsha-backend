import {Repository, FindOptionsWhere, FindOneOptions, FindOptions, FindManyOptions} from 'typeorm';
import { GenericRepository } from 'src/core/abstracts';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import {Success} from "../../../shared/types/Success.type";

export class PostgreGenericRepository<T> implements GenericRepository<T> {
  private _repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this._repository = repository;
  }

  async getAll(pagination?: number, count?: number): Promise<T[]> {
    const options =
      pagination !== undefined && count !== undefined
        ? { skip: pagination * count, take: count }
        : {};
    return this._repository.find(options);
  }

  async get(criteria: FindOneOptions<T>): Promise<T> {
    return this._repository.findOne(criteria);
  }

  async getMany(criteria: FindManyOptions<T>): Promise<T[]> {
    return this._repository.find(criteria);
  }

  async getByIds(ids: number[] | string[]): Promise<T[]> {
    return this._repository.findByIds(ids);
  }

  create(item: QueryDeepPartialEntity<T>): T {
    return this._repository.create(item as T);
  }

  async save(item: T): Promise<T> {
    return this._repository.save(item);
  }

  async update(
    criteria: FindOptionsWhere<T>,
    item: QueryDeepPartialEntity<T>,
  ): Promise<T> {
    const existingItem = await this.get(criteria);
    if (!existingItem) {
      throw new Error('Entity not found');
    }
    Object.assign(existingItem, item);
    return this._repository.save(existingItem);
  }

  async delete(criteria: FindOptionsWhere<T>): Promise<Success> {
    try {
      const result = await this._repository.delete(criteria);
      return { success: result.affected > 0 };
    } catch (error) {
      return { success: false };
    }
  }
}
