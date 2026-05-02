import { InMemoryTodoRepository } from './infrastructure/repositories/InMemoryTodoRepository';
import { CreateTodoUseCase } from './application/use-cases/CreateTodoUseCase';
import { GetAllTodosUseCase } from './application/use-cases/GetAllTodosUseCase';
import { GetTodoByIdUseCase } from './application/use-cases/GetTodoByIdUseCase';
import { UpdateTodoUseCase } from './application/use-cases/UpdateTodoUseCase';
import { DeleteTodoUseCase } from './application/use-cases/DeleteTodoUseCase';
import { TodoController } from './adapters/controllers/TodoController';
import { createApp } from './infrastructure/http/server';

/**
 * COMPOSITION ROOT — main.ts
 * C'est le seul endroit où toutes les couches sont assemblées.
 * Remplacer InMemoryTodoRepository par une implémentation SQL se fait ICI.
 */

// 1. Infrastructure : instanciation du dépôt concret
const todoRepository = new InMemoryTodoRepository();

// 2. Application : injection du dépôt dans chaque use case
const createTodoUseCase = new CreateTodoUseCase(todoRepository);
const getAllTodosUseCase = new GetAllTodosUseCase(todoRepository);
const getTodoByIdUseCase = new GetTodoByIdUseCase(todoRepository);
const updateTodoUseCase = new UpdateTodoUseCase(todoRepository);
const deleteTodoUseCase = new DeleteTodoUseCase(todoRepository);

// 3. Adapters : injection des use cases dans le contrôleur
const todoController = new TodoController(
  createTodoUseCase,
  getAllTodosUseCase,
  getTodoByIdUseCase,
  updateTodoUseCase,
  deleteTodoUseCase,
);

// 4. Infrastructure HTTP : démarrage du serveur
const PORT = process.env['PORT'] ?? 3000;
const app = createApp(todoController);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Health check : http://localhost:${PORT}/health`);
  console.log(`API Todos    : http://localhost:${PORT}/api/todos`);
});
