import { Todo } from '../entities/Todo';

/**
 * PORT (interface) — ITodoRepository
 * Défini dans le domaine, implémenté dans l'infrastructure.
 * Le domaine ne connaît JAMAIS la base de données.
 */
export interface ITodoRepository {
  save(todo: Todo): Promise<void>;
  findById(id: string): Promise<Todo | null>;
  findAll(): Promise<Todo[]>;
  update(todo: Todo): Promise<void>;
  delete(id: string): Promise<void>;
}
