import { ITodoRepository } from '../../domain/repositories/ITodoRepository';
import { TodoResponseDTO } from '../dtos/TodoResponseDTO';
import { toTodoDTO } from '../mappers/todoMapper';

/**
 * USE CASE — Lister tous les Todos
 */
export class GetAllTodosUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(): Promise<TodoResponseDTO[]> {
    const todos = await this.todoRepository.findAll();
    return todos.map(toTodoDTO);
  }
}

