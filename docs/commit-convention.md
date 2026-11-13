# Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

## Format

```
<type>(<scope>): <short description>

<optional body: what changed and why>
```

- **type**: the kind of change (see the table below).
- **scope**: optional. The part of the project that changed, for example `ai`, `form`, `mocks`.
- **short description**: one line, present tense, lower case, no full stop at the end.
- **body**: optional. Use it when the title alone does not explain the reason for the change.

The prefix is only text in the commit message. `docs(ai)` is not a file or a folder: it means "a documentation change in the AI usage report".

## Types

| Type       | Use it for                                                  |
| ---------- | ----------------------------------------------------------- |
| `feat`     | A new feature                                               |
| `fix`      | A bug fix                                                   |
| `docs`     | Documentation only (`README.md`, `ai.md`, files in `docs/`) |
| `test`     | Adding or changing tests                                    |
| `refactor` | Code change that is neither a feature nor a fix             |
| `style`    | Formatting only, no change in behaviour                     |
| `chore`    | Tooling, config, dependencies                               |

## Examples

```
chore: scaffold Vite + React + TypeScript app
docs: start AI usage log from template
docs(ai): complete ai.md with workflow, models and prompt log
feat(form): render fields from the server schema
test(form): cover required and file size validation
```

## How to commit

```
git add ai.md
git commit -m "docs(ai): complete ai.md with workflow, models and prompt log"
```
