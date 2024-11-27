import {FindManyOptions, FindOneOptions, FindOptions, FindOptionsWhere} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import {Success} from "../../shared/types/Success.type";

export abstract class GenericRepository<T> {
  /**
   * Retrieves all entities with optional pagination.
   * @param pagination The page number to retrieve.
   * @param count The number of entities per page.
   * @returns A promise that resolves to an array of entities.
   */
  abstract getAll(pagination?: number, count?: number): Promise<T[]>;

  /**
   * Retrieves a single entity based on the given criteria.
   * @param criteria The criteria to find the entity.
   * @returns A promise that resolves to the found entity.
   */
  abstract get(criteria: FindOneOptions<T>): Promise<T>;

  /**
   * Retrieves multiple entities based on the given criteria.
   * @param criteria The criteria to find the entities.
   * @returns A promise that resolves to an array of entities.
   */
  abstract getMany(criteria: FindManyOptions<T>): Promise<T[]>;

  /**
   * Retrieves entities by their IDs.
   * @param ids An array of IDs to find the entities.
   * @returns A promise that resolves to an array of entities.
   */
  abstract getByIds(ids: string[] | number[]): Promise<T[]>;

  /**
   * Creates a new entity based on the provided item.
   * @param item The item to create.
   * @returns The created entity.
   */
  abstract create(item: QueryDeepPartialEntity<T>): T;

  /**
   * Saves an entity to the database.
   * @param item The entity to save.
   * @returns A promise that resolves to the saved entity.
   */
  abstract save(item: T): Promise<T>;

  /**
   * Updates an existing entity based on the given criteria and item.
   * @param item The new item to update the entity with.
   * @param criteria The criteria to find the entity.
   * @returns A promise that resolves to the updated entity.
   */
  abstract update(
    criteria: FindOptionsWhere<T>,
    item: QueryDeepPartialEntity<T>,
  ): Promise<T>;

  /**
   * Deletes an entity based on the given criteria.
   * @param criteria The criteria to find the entity to delete.
   * @returns A promise that resolves to a success indicator.
   */
  abstract delete(criteria: unknown): Promise<Success>;
}
