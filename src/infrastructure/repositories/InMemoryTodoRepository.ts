import { Todo } from '../../domain/entities/Todo';
import { ITodoRepository } from '../../domain/repositories/ITodoRepository';

/**
 * INFRASTRUCTURE — InMemoryTodoRepository
 * Implémentation concrète du port ITodoRepository.
 * Stocke les todos en mémoire (idéal pour le développement / les tests).
 * Remplacez cette classe par une implémentation SQL/NoSQL sans toucher
 * au domaine ni aux use cases.
 */
export class InMemoryTodoRepository implements ITodoRepository {
  private readonly store = new Map<string, Todo>();

  async save(todo: Todo): Promise<void> {
    this.store.set(todo.id, todo);
  }

  async findById(id: string): Promise<Todo | null> {
    return this.store.get(id) ?? null;
  }

  async findAll(): Promise<Todo[]> {
    return Array.from(this.store.values());
  }

  async update(todo: Todo): Promise<void> {
    this.store.set(todo.id, todo);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
