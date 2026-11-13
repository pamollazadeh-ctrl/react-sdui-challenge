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

## The API contract

The sample response from the task is kept as it is, with three additions (the task
allows restructuring):

- `required` on a field, so "all required fields are filled" is driven by the server.
- `minLength` / `maxLength` in `props` for text rules.
- Optional `title` and `submitLabel` at the top level.

Numbers that arrive as strings (`"max": "2024"`) are coerced once, at the boundary.
A field with an unknown `type` is skipped with a console warning and the rest of the
form still renders, so the server can ship a new field type before the client knows it.

## Mock API

The backend is still in development, so the API is mocked with
[MSW](https://mswjs.io/). The same handlers (`src/mocks/handlers.ts`) run in the
browser through a service worker and in Node for the tests, so the app and the tests
agree on one contract. Requests are real `fetch` calls, visible in the network tab.

To use a real backend, set this in `.env.local`:

```
VITE_API_MOCKING=disabled
VITE_API_BASE_URL=https://example.com/api
```

No application code changes.

## Code quality

- TypeScript in strict mode, plus `noUncheckedIndexedAccess`. No `any`.
- Oxlint with type-aware rules, React hooks and `jsx-a11y`. typescript-eslint does
  not support TypeScript 7 yet, which is why the linter is Oxlint and not ESLint.
- Prettier for formatting.
- Husky + lint-staged run the linter and Prettier on staged files before each commit.
- Commits follow [Conventional Commits](docs/commit-convention.md).
