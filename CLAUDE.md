# Dynamic Form Builder

React 19 + TypeScript 7 + Vite 8. A form rendered from a server schema.
Read `README.md` for the overview and `docs/architecture.md` for the decisions.

## Commands

- `npm run check` runs typecheck, lint, format check and tests. Run it before saying a task is done.
- `npm run test -- <path>` runs one test file.
- `npm run dev` starts the app with the MSW mock API.

## Tests

- Vitest + Testing Library. Query by role and label, not by class or test id.
- Network is mocked with MSW (`src/mocks/handlers.ts`). An unhandled request fails the test.
- Tests that send a real multipart body run with `// @vitest-environment node`.
- New behaviour needs a test in the same change.

## Git

- Conventional Commits, see `docs/commit-convention.md`. One logical step per commit.
- Do not commit, push or change branches unless asked.
- `ai.md` is written by the author. Do not edit it.
