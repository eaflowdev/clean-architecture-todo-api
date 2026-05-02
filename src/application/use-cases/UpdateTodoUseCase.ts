import { TodoStatus } from '../../domain/entities/Todo';
import { ITodoRepository } from '../../domain/repositories/ITodoRepository';
import { TodoNotFoundError } from '../../domain/errors/TodoErrors';
import { TodoResponseDTO } from '../dtos/TodoResponseDTO';
import { toTodoDTO } from '../mappers/todoMapper';

export interface UpdateTodoInput {
  id: string;
  title?: string;
  description?: string;
  status?: TodoStatus;
}

/**
 * USE CASE — Modifier un Todo
 */
export class UpdateTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(input: UpdateTodoInput): Promise<TodoResponseDTO> {
    const todo = await this.todoRepository.findById(input.id);
    if (!todo) throw new TodoNotFoundError(input.id);

    todo.update({ title: input.title, description: input.description, status: input.status });
    await this.todoRepository.update(todo);
    return toTodoDTO(todo);
  }
}

