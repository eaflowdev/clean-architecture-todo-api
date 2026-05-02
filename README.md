# Clean Architecture — Todo API



## Qu'est-ce que la Clean Architecture ?

L'idée centrale est simple : **le code métier ne doit jamais dépendre des détails techniques** (base de données, framework HTTP, librairies externes). C'est toujours l'inverse : les détails techniques dépendent du métier.

### Le diagramme original

```
         ┌─────────────────────────────────────┐
         │         Infrastructure               │  ← Express, BDD, fichiers...
         │   ┌─────────────────────────────┐   │
         │   │         Adapters             │   │  ← Contrôleurs, routes
         │   │   ┌─────────────────────┐   │   │
         │   │   │     Application      │   │   │  ← Use Cases
         │   │   │   ┌─────────────┐   │   │   │
         │   │   │   │   Domain    │   │   │   │  ← Entités, règles métier
         │   │   │   └─────────────┘   │   │   │
         │   │   └─────────────────────┘   │   │
         │   └─────────────────────────────┘   │
         └─────────────────────────────────────┘
```

### La règle fondamentale : la règle de dépendance

> Les flèches de dépendance ne pointent que **vers l'intérieur**.

```
Infrastructure → Adapters → Application → Domain
```

- Le **Domain** ne connaît rien d'autre que lui-même.
- L'**Application** connaît uniquement le Domain.
- Les **Adapters** connaissent l'Application et le Domain.
- L'**Infrastructure** peut tout connaître, mais communique avec l'Application via des **interfaces** (ports).

Si cette règle est respectée, on peut **remplacer n'importe quelle couche externe** sans toucher au code métier.

---

## Les 4 couches en détail

### 1. Domain — Le cœur de l'application

C'est la couche la plus importante et la plus stable. Elle contient :

- **Les entités** : des classes qui représentent les concepts métier avec leurs règles. Exemple : un `Todo` ne peut pas avoir un titre vide — c'est une règle métier, pas une contrainte technique.
- **Les interfaces de dépôt (ports)** : `ITodoRepository` définit *ce qu'on veut pouvoir faire* avec les todos (sauvegarder, trouver, supprimer...), sans dire *comment* c'est fait.
- **Les erreurs métier** : `TodoNotFoundError` est une erreur qui a un sens dans le domaine, pas juste un code HTTP 404.

**Dépendances : aucune.** Ce code peut tourner sans Express, sans base de données, sans rien.

---

### 2. Application — Les cas d'usage

Cette couche orchestre le flux d'une fonctionnalité. Un **use case** répond à la question : *"Que se passe-t-il quand l'utilisateur fait X ?"*

Chaque use case :
1. Reçoit des données en entrée (un DTO ou des paramètres simples)
2. Appelle le dépôt pour lire/écrire des données (via l'interface, jamais l'implémentation concrète)
3. Applique ou délègue la logique métier à l'entité
4. Retourne un résultat

**Dépendances : uniquement le Domain.** Pas d'Express, pas de SQL.

---

### 3. Adapters — La traduction

Les adaptateurs font le lien entre le monde extérieur et les use cases. Leur seul rôle est de **traduire** :

- Une **requête HTTP** → appel d'un use case → **réponse HTTP**
- Ils ne contiennent aucune logique métier.

Si demain on remplace Express par Fastify, ou qu'on ajoute une CLI, seule cette couche change.

**Dépendances : Application + Domain.**

---

### 4. Infrastructure — Les détails techniques

C'est ici que vivent tous les détails concrets : base de données, frameworks, librairies. Cette couche **implémente les interfaces** définies dans le Domain.

Pour passer à PostgreSQL, on crée `PostgresTodoRepository` qui implémente la même interface — **le reste de l'application ne change pas**.

**Dépendances : tout** (c'est le seul endroit où les frameworks sont importés).

---

### 5. Composition Root — Le câblage

`main.ts` est le seul endroit où toutes les couches sont assemblées ensemble. C'est ici qu'on fait l'**injection de dépendances** à la main :

Changer `InMemoryTodoRepository` en `PostgresTodoRepository` se fait **uniquement ici**.

---

## Structure du projet

```
src/
├── domain/                         ← Couche Domaine (règles métier pures)
│   ├── entities/
│   │   └── Todo.ts                 ← Entité Todo avec invariants métier
│   ├── repositories/
│   │   └── ITodoRepository.ts      ← Port (interface) du dépôt
│   └── errors/
│       └── TodoErrors.ts           ← Erreurs métier
│
├── application/                    ← Couche Application (orchestration)
│   ├── dtos/
│   │   └── TodoResponseDTO.ts      ← Objet de transfert de données
│   ├── mappers/
│   │   └── todoMapper.ts           ← Convertit une entité en DTO
│   └── use-cases/
│       ├── CreateTodoUseCase.ts
│       ├── GetAllTodosUseCase.ts
│       ├── GetTodoByIdUseCase.ts
│       ├── UpdateTodoUseCase.ts
│       └── DeleteTodoUseCase.ts
│
├── adapters/                       ← Couche Adaptateurs (interface HTTP)
│   ├── controllers/
│   │   └── TodoController.ts       ← Traduit HTTP ↔ Use Cases
│   └── routes/
│       └── todoRoutes.ts           ← Définition des routes Express
│
├── infrastructure/                 ← Couche Infrastructure (détails techniques)
│   ├── repositories/
│   │   └── InMemoryTodoRepository.ts  ← Implémentation du port
│   └── http/
│       └── server.ts               ← Configuration Express
│
└── main.ts                         ← Composition Root (câblage des dépendances)
```

---

## Démarrage

```bash
npm install
npm run dev       # Mode développement (ts-node + nodemon)
npm run build     # Compilation TypeScript → dist/
npm start         # Exécution depuis dist/
```

---

## API Endpoints

| Méthode | Route            | Description           |
|---------|------------------|-----------------------|
| POST    | /api/todos       | Créer un todo         |
| GET     | /api/todos       | Lister tous les todos |
| GET     | /api/todos/:id   | Obtenir un todo       |
| PUT     | /api/todos/:id   | Modifier un todo      |
| DELETE  | /api/todos/:id   | Supprimer un todo     |
| GET     | /health          | Health check          |

### Statuts possibles

- `pending` — À faire (défaut à la création)
- `in-progress` — En cours
- `done` — Terminé

---

## Remplacer le dépôt en mémoire par une base de données

1. Créer `src/infrastructure/repositories/PostgresTodoRepository.ts` qui implémente `ITodoRepository`.
2. Dans `src/main.ts`, remplacer `InMemoryTodoRepository` par `PostgresTodoRepository`.
3. **Aucune autre couche n'est modifiée** — c'est le principe d'inversion des dépendances.

