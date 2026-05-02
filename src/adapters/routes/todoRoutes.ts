import { Router } from 'express';
import { TodoController } from '../controllers/TodoController';

/**
 * ADAPTER — todoRouter
 * Définit les routes HTTP et les délègue au contrôleur.
 */
export function createTodoRouter(controller: TodoController): Router {
  const router = Router();

  router.post('/', (req, res) => controller.create(req, res));
  router.get('/', (req, res) => controller.getAll(req, res));
  router.get('/:id', (req, res) => controller.getById(req, res));
  router.put('/:id', (req, res) => controller.update(req, res));
  router.delete('/:id', (req, res) => controller.remove(req, res));

  return router;
}
