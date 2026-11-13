# Dynamic Form Builder

A React form whose structure comes from the server. The app asks the API for a form
definition (fields, options, validation rules), renders it, validates what the user
enters and sends the result back as `multipart/form-data`, files included.

Adding or changing a field is a server-side change. The client needs no release.

## Quick start

Requires Node 20 or newer (`.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:5173, API mocked by MSW
```

| Script               | What it does                                  |
| -------------------- | --------------------------------------------- |
| `npm run dev`        | Dev server with the mock API                  |
| `npm run build`      | Type-check, then production build             |
| `npm run test`       | Unit and component tests (Vitest), single run |
| `npm run test:watch` | Tests in watch mode                           |
| `npm run typecheck`  | `tsc -b`                                      |
| `npm run lint`       | Oxlint with type-aware rules                  |
| `npm run format`     | Prettier, write                               |
| `npm run check`      | Type-check, lint, format check and tests      |

## Code quality

- TypeScript in strict mode, plus `noUncheckedIndexedAccess`. No `any`.
- Oxlint with type-aware rules, React hooks and `jsx-a11y`. typescript-eslint does
  not support TypeScript 7 yet, which is why the linter is Oxlint and not ESLint.
- Prettier for formatting.
- Husky + lint-staged run the linter and Prettier on staged files before each commit.
- Commits follow [Conventional Commits](docs/commit-convention.md).
