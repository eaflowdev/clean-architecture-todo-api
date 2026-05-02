import { Todo } from '../../domain/entities/Todo';
import { TodoResponseDTO } from '../dtos/TodoResponseDTO';

export function toTodoDTO(todo: Todo): TodoResponseDTO {
  return {
    id: todo.id,
    title: todo.title,
    description: todo.description,
    status: todo.status,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
  };
}
