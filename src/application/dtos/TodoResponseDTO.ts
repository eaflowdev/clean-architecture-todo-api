import { TodoStatus } from '../../domain/entities/Todo';

/** DTO de sortie partagé par tous les use cases. */
export interface TodoResponseDTO {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
}
