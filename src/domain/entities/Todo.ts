export type TodoStatus = 'pending' | 'in-progress' | 'done';

/**
 * ENTITÉ DOMAINE — Todo
 * Contient les données et les règles métier pures.
 * Aucune dépendance externe (pas d'Express, pas de base de données).
 */
export class Todo {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public status: TodoStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {
    if (!title || title.trim().length === 0) {
      throw new Error('Le titre est obligatoire.');
    }
    if (title.trim().length > 100) {
      throw new Error('Le titre ne peut pas dépasser 100 caractères.');
    }
    this.title = title.trim();
    this.description = description.trim();
  }

  /** Met à jour les champs modifiables et horodate la modification. */
  update(fields: { title?: string; description?: string; status?: TodoStatus }): void {
    if (fields.title !== undefined) {
      if (fields.title.trim().length === 0) throw new Error('Le titre est obligatoire.');
      if (fields.title.trim().length > 100) throw new Error('Le titre ne peut pas dépasser 100 caractères.');
      this.title = fields.title.trim();
    }
    if (fields.description !== undefined) this.description = fields.description.trim();
    if (fields.status !== undefined) this.status = fields.status;
    this.updatedAt = new Date();
  }
}
