import { ITodoRepository } from '../../domain/repositories/ITodoRepository';
import { TodoNotFoundError } from '../../domain/errors/TodoErrors';
import { TodoResponseDTO } from '../dtos/TodoResponseDTO';
import { toTodoDTO } from '../mappers/todoMapper';

/**
 * USE CASE — Obtenir un Todo par son id
 */
export class GetTodoByIdUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(id: string): Promise<TodoResponseDTO> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) throw new TodoNotFoundError(id);
    return toTodoDTO(todo);
  }
}

