# Dynamic Form Builder

React 19 + TypeScript 7 + Vite 8. A form rendered from a server schema.
Read `README.md` for the overview and `docs/architecture.md` for the decisions.

## Commands

- `npm run check` runs typecheck, lint, format check and tests. Run it before saying a task is done.
- `npm run test -- <path>` runs one test file.
- `npm run dev` starts the app with the MSW mock API.

## Rules

- Layers import one way: `app -> features -> design-system -> lib`. The design system never imports a feature.
- Features import UI from `@/design-system` only, never from a deep path.
- Components use design tokens from `design-system/styles/tokens.css`. No hard-coded colours or spacing.
- Every file stays under 100 lines. Split before it grows.
- No `any`, no non-null `!`, no type casts to silence the compiler.
- Icons come from `lucide-react`. No raw `<svg>`.
- Logic lives in hooks and pure functions. Components render.
- User-facing text goes in `features/dynamic-form/constants/messages.ts` (Persian, RTL).
- Forms use React Hook Form with a Zod resolver.
- A comment explains why a decision was made, not what the line does.
- The linter is Oxlint. Do not add ESLint: typescript-eslint does not support TypeScript 7.

## Tests

- Vitest + Testing Library. Query by role and label, not by class or test id.
- Network is mocked with MSW (`src/mocks/handlers.ts`). An unhandled request fails the test.
- Tests that send a real multipart body run with `// @vitest-environment node`.
- New behaviour needs a test in the same change.

## Git

- Conventional Commits, see `docs/commit-convention.md`. One logical step per commit.
- Do not commit, push or change branches unless asked.
- `ai.md` is written by the author. Do not edit it.
