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

## How it works

```
GET  /api/forms/:formId              -> form schema (JSON)
POST /api/forms/:formId/submissions  -> multipart/form-data (text values + files)
```

1. `useFormSchema` fetches the schema and `parseFormSchema` validates it with Zod.
2. `buildValidator` turns the fields into a Zod validator, `buildDefaultValues` into
   the initial state. React Hook Form holds the values.
3. `FieldRenderer` maps each field `type` to a component built from the design system.
4. On submit, `toFormData` packages the values and `submitForm` posts them. A `422`
   with `fieldErrors` is shown on the matching fields.

Supported field types: `input` (text, number), `textarea`, `select`, `file`.

## Project structure

```
src/
  app/                    Page shell
  design-system/          Tokens, base styles, UI primitives (no feature knowledge)
  features/dynamic-form/
    api/                  fetch wrapper, form endpoints
    schema/               Zod contract of the server response, inferred types
    validation/           Pure validators and the Zod validator builder
    hooks/                useFormSchema, useDynamicForm
    components/           DynamicFormLoader, DynamicForm, FieldRenderer, fields/
    utils/                FormData packaging, default values, style allow-list
    constants/            User-facing messages
  lib/                    Small shared helpers
  mocks/                  MSW handlers and the sample form
  test/                   Test setup, factories, form harness
```

Dependencies point one way: `app -> features -> design-system -> lib`. The design
system never imports from a feature. See [docs/architecture.md](docs/architecture.md)
for the decisions behind this layout.

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

## Validation

| Rule                        | Source in the schema                             |
| --------------------------- | ------------------------------------------------ |
| Required                    | `required`                                       |
| Text length                 | `props.minLength`, `props.maxLength`             |
| Number and range            | `props.type: "number"`, `props.min`, `props.max` |
| Value is one of the options | `props.options`                                  |
| File format                 | `props.accept`                                   |
| File size                   | `props.maxSize` (`"5MB"`)                        |
| Single or multiple files    | `props.multiple`                                 |

A field is validated on blur, then on every change once it has an error. On submit,
focus moves to the first invalid field. Errors are linked to their control with
`aria-describedby` and announced with `role="alert"`.

## Testing

```bash
npm run test
```

- **Unit**: validators, validator builder, schema parsing, file rules, size parsing,
  `FormData` packaging, style allow-list.
- **API**: `formApi` against the MSW handlers in a Node environment, including the
  real multipart body and the `422` path.
- **Component**: the whole form through `DynamicFormLoader`, driven like a user with
  Testing Library: rendering from the schema, validation, upload, submit, server
  errors, load failure and retry.

Tests query by role and label, so they also check the accessibility wiring.

## Code quality

- TypeScript in strict mode, plus `noUncheckedIndexedAccess`. No `any`.
- Oxlint with type-aware rules, React hooks and `jsx-a11y`. typescript-eslint does
  not support TypeScript 7 yet, which is why the linter is Oxlint and not ESLint.
- Prettier for formatting.
- Husky + lint-staged run the linter and Prettier on staged files before each commit.
- Commits follow [Conventional Commits](docs/commit-convention.md).
