import express, { Application } from 'express';
import { createTodoRouter } from '../../adapters/routes/todoRoutes';
import { TodoController } from '../../adapters/controllers/TodoController';

/**
 * INFRASTRUCTURE — createApp
 * Configure l'application Express : middlewares, routes.
 * Séparé de main.ts pour faciliter les tests d'intégration.
 */
export function createApp(todoController: TodoController): Application {
  const app = express();

  app.use(express.json());

  // Health check
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Routes todos
  app.use('/api/todos', createTodoRouter(todoController));

  return app;
}
