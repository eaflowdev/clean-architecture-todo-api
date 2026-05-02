import { v4 as uuidv4 } from 'uuid';
import { Todo } from '../../domain/entities/Todo';
import { ITodoRepository } from '../../domain/repositories/ITodoRepository';
import { TodoResponseDTO } from '../dtos/TodoResponseDTO';
import { toTodoDTO } from '../mappers/todoMapper';

export interface CreateTodoInput {
  title: string;
  description: string;
}

/**
 * USE CASE — Créer un Todo
 */
export class CreateTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(input: CreateTodoInput): Promise<TodoResponseDTO> {
    const now = new Date();
    const todo = new Todo(uuidv4(), input.title, input.description ?? '', 'pending', now, now);
    await this.todoRepository.save(todo);
    return toTodoDTO(todo);
  }
}

