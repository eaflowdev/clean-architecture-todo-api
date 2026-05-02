import { ITodoRepository } from '../../domain/repositories/ITodoRepository';
import { TodoNotFoundError } from '../../domain/errors/TodoErrors';

/**
 * USE CASE — DeleteTodo
 */
export class DeleteTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.todoRepository.findById(id);
    if (!existing) {
      throw new TodoNotFoundError(id);
    }
    await this.todoRepository.delete(id);
  }
}
