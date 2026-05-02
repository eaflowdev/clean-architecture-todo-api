import { Request, Response } from 'express';
import { CreateTodoUseCase } from '../../application/use-cases/CreateTodoUseCase';
import { GetAllTodosUseCase } from '../../application/use-cases/GetAllTodosUseCase';
import { GetTodoByIdUseCase } from '../../application/use-cases/GetTodoByIdUseCase';
import { UpdateTodoUseCase } from '../../application/use-cases/UpdateTodoUseCase';
import { DeleteTodoUseCase } from '../../application/use-cases/DeleteTodoUseCase';
import { TodoNotFoundError } from '../../domain/errors/TodoErrors';

/**
 * ADAPTER — TodoController
 * Traduit les requêtes HTTP en appels aux use cases,
 * et les réponses des use cases en réponses HTTP.
 * Il ne contient aucune logique métier.
 */
export class TodoController {
  constructor(
    private readonly createTodo: CreateTodoUseCase,
    private readonly getAllTodos: GetAllTodosUseCase,
    private readonly getTodoById: GetTodoByIdUseCase,
    private readonly updateTodo: UpdateTodoUseCase,
    private readonly deleteTodo: DeleteTodoUseCase,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { title, description } = req.body as { title?: string; description?: string };
      if (typeof title !== 'string') {
        res.status(400).json({ error: 'Le champ "title" est requis.' });
        return;
      }
      const result = await this.createTodo.execute({
        title,
        description: description ?? '',
      });
      res.status(201).json(result);
    } catch (err) {
      this.handleError(err, res);
    }
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const result = await this.getAllTodos.execute();
      res.status(200).json(result);
    } catch (err) {
      this.handleError(err, res);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.getTodoById.execute(req.params['id'] as string);
      res.status(200).json(result);
    } catch (err) {
      this.handleError(err, res);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, status } = req.body as {
        title?: string;
        description?: string;
        status?: string;
      };
      const result = await this.updateTodo.execute({
        id: req.params['id'] as string,
        title,
        description,
        status: status as 'pending' | 'in-progress' | 'done' | undefined,
      });
      res.status(200).json(result);
    } catch (err) {
      this.handleError(err, res);
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      await this.deleteTodo.execute(req.params['id'] as string);
      res.status(204).send();
    } catch (err) {
      this.handleError(err, res);
    }
  }

  private handleError(err: unknown, res: Response): void {
    if (err instanceof TodoNotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}
