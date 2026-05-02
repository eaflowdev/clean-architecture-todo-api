export class TodoNotFoundError extends Error {
  constructor(id: string) {
    super(`Todo avec l'id "${id}" introuvable.`);
    this.name = 'TodoNotFoundError';
  }
}

export class TodoValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TodoValidationError';
  }
}
