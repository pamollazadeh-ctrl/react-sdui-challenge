# AI Usage Report

I write down the requirements first, split the feature into small tasks, and then go through the same steps every time (analysis, plan, code, tests, review). AI helps me in all of them, but I never treat its output as correct just because it compiles. I test it, I read the diff, and I compare it with what the task actually asked for.

---

## 1. Tools & Models

| Tool / Product | Model | Purpose | Frequency |
|---|---|---|---|
| Claude Code (CLI) | Claude Sonnet 5.5 | Writing features and tests, running them, fixing what breaks | Most of the time, it's my default |
| Claude Code (CLI) | Claude Opus | Architecture, planning, hard bugs, code review and security review | Only for planning and review |
| Claude Code (CLI) | Claude Haiku | Searching the code, reading files, collecting info, small edits | Often, for the cheap stuff |
| Playwright MCP | — | Testing the app in a real browser | During testing |

So basically: Opus plans and reviews, Sonnet writes the code, Haiku does the searching. It's not a strict rule. If a "simple" task turns out to be complicated I move it up to a stronger model, and I don't use Opus for things Sonnet can do well.

One more thing about reviews: I run them in a new session. If I ask the same session that wrote the code to review it, it already believes its own assumptions and mostly agrees with itself.

---

## 2. Stages of Development

### Planning / Requirements Analysis

I gave the assistant the README and the sample `ai.md` and asked for a plan that I could follow step by step myself, not a finished project.

In this stage I use AI to read the task carefully and tell me what is missing or unclear, which edge cases and failure scenarios I should expect, what depends on what, and how to split the feature into smaller tasks. I read the analysis and I make the decisions. Nothing moves forward before that.

### Codebase Exploration

Before writing any code I ask AI to explain the project to me: the folder structure, the architecture and patterns already in use, which components and utilities I can reuse, the dependencies and config, how tests are written, and where the design system is plugged in.

The reason is simple. I want new code to look like it belongs to the project. I don't want a second version of something that already exists, or a new abstraction nobody needs.

### Technical Planning and Architecture

Here I ask for a few possible approaches and one clear plan. The things I look at are the component structure and separation of concerns, what can be a reusable component or hook, data flow and state, API calls and error handling, how validation is organised, and how the whole thing will be tested. I also think about whether it will still be easy to maintain when it grows.

I review the plan before any implementation starts. Sometimes I approve it, sometimes I change parts of it.

### Scaffolding / Boilerplate

AI helped me with the project setup and tooling: Vite + React + TypeScript, lint and format config, pre-commit hooks. I ask for each piece as a separate commit, and I ask the assistant to check the config against the versions in my `package.json` before giving it to me, because configs for the wrong major version waste a lot of time.

### Implementation

I use Sonnet for this, based on the plan I approved. What I care about: code that is clean and easy to read, reusable components, logic separated from UI, type safety, consistent names, proper error handling, performance, and comments that explain why a decision was made.

I also use AI development skills where they fit, so the code follows known good practices and not just whatever the model prefers that day.

### Testing and Debugging

I don't trust AI-generated tests blindly. AI helps me design the test cases, think of edge cases, write the tests and investigate failures. Then I run them myself and I read the assertions, because a test that passes is not always a test that checks something.

What I try to cover: unit tests, component tests, integration tests, form validation, API interaction, error handling, edge cases, and end-to-end where it makes sense.

For the browser part I use the Playwright MCP integration. AI prepares and runs the scenarios, and I look at the results and at the real behaviour of the app.

### Code Review / Quality Assurance

When the code and tests are done, I ask for an independent review. I want to hear about possible bugs and unexpected behaviour, things that don't fit the architecture, unnecessary complexity, performance, security, accessibility, duplicated code, missing tests, and anything that will be hard to maintain.

I don't apply review suggestions automatically. Some of them are wrong or not relevant for this project, so I check every one against the requirements and the real code first.

### Final Verification

Before I call a feature done I check these myself:

- every requirement is implemented
- tests pass
- the app behaves as expected
- error cases are handled
- nothing that worked before is broken
- the code follows the project standards

AI helps the whole way, but accepting the result is my job.

---

## 3. Prompts

A few words on how I prompt. I don't write broad instructions like "build the form". I give the exact goal, the relevant files and context, the constraints that already exist, the expected behaviour and acceptance criteria, what tests I want, and what the assistant is not allowed to touch.

For anything important the order is always the same: analyse first, propose a plan, wait for my approval, then implement.

When I evaluate an answer I ask three questions. Is it technically correct? Does it fit the existing architecture? Does it do what the requirements say? When the AI assumes something wrong, adds abstractions I didn't ask for, writes incomplete tests or changes things outside the scope, I fix my instructions and ask for a focused revision of that part only.

### Prompt #1
  Read README.md  in react-sdui-challenge. Do not build the project.
  Give me a step-by-step plan that I will carry out myself: one branch and one PR per step,
  Conventional Commits, and for each step what I should log in ai.md.
  Standards: strict TypeScript, ESLint + Prettier, pre-commit hooks, tests, and a folder
  structure that is easy to test and document.
  Ask me before choosing the stack or touching git.

### Prompt #2
  What would json-server cost me compared with MSW in this project,
  given the multipart upload and the tests?

### Prompt #3
  Step 2, tooling. Go with MSW for the mock.
  Give me strict type-aware ESLint, Prettier, a stricter tsconfig and pre-commit hooks,
  each as its own commit. Check the config against the dependency versions
  in my package.json before you hand it to me.

### Prompt #4
  Analyze the task description carefully. Identify all functional requirements, technical
  requirements, edge cases, dependencies, and potential risks. Do not modify any files.
  Return a structured implementation checklist and highlight any ambiguities.

### Prompt #5
  Explore the existing project structure and identify the current architecture, design system,
  reusable components, hooks, API utilities, and testing setup. Explain how a new feature
  should integrate with the existing codebase. Do not make any changes.

### Prompt #6
  Based on the requirements and existing codebase, propose a maintainable and reusable
  architecture for this feature. Explain component responsibilities, data flow, API
  integration, validation, error handling, and testing strategy. Avoid unnecessary
  abstractions. Do not implement anything until the plan is reviewed.
15k
### Prompt #7
  Implement the approved feature using the existing project architecture and design system.
  Prioritize clean, readable, reusable, and maintainable code. Follow established naming
  conventions, handle errors properly, and avoid unrelated modifications. Explain important
  implementation decisions in the code where necessary.

### Prompt #8
  Analyze the implemented feature and generate comprehensive tests covering normal behavior,
  validation, edge cases, error handling, and unexpected inputs. Follow the existing testing
  conventions. Identify any missing scenarios before implementing the tests.

### Prompt #9
  Use the available Playwright MCP integration to test the feature from a real user
  perspective. Cover the primary user flows, form interactions, validation errors, file
  uploads, API failures, and successful submissions. Report failed scenarios with
  reproducible steps. Do not assume that a successful browser interaction automatically
  means the feature is correct.

### Prompt #10
  Review the implementation independently as a senior frontend engineer. Focus on
  correctness, architecture, maintainability, performance, accessibility, security, and
  test coverage. Identify concrete issues and explain why each one matters. Do not modify
  files. Prioritize findings by severity.

### Prompt #11
MODEL: Sonnet 5.5
TOKEN: 350K
  I want:
  - Prettier with a small config and an ignore file (skip dist, ai.md, sample.ai.md)
  - type-aware linting with no `any` and basic a11y rules. I'd prefer ESLint, but if it
    doesn't support my TypeScript version, tell me and suggest an alternative before you install anything
  - stricter tsconfig (strict, noUncheckedIndexedAccess) and an @/ alias for src
  - Vitest set up in vite.config.ts, no tests yet
  - husky + lint-staged pre-commit hook
  - npm scripts: typecheck, lint, format, format:check, test, and one `check` that runs all of them



## 4. Token Usage Monitoring

I do watch token usage, and it affects which model I pick and how I write prompts. But the goal is not the smallest number. I want a good balance between quality, reasoning, speed and cost.

**Context and memory**

For the current task I keep the context small and focused: the feature I'm working on, the files that matter, the decisions already made, where I am, and what is still open.

For the long term I keep project instructions and notes that the AI reads in every session (architecture, coding standards, conventions, important decisions). That way I don't explain the same things again and again, and features stay consistent with each other. I keep these files short on purpose, because they are loaded every single time.

**What I do to keep usage down**

1. One session per task. I don't drag an old conversation into unrelated work.
2. Specific prompts: exact files, functions, expected behaviour and scope.
3. Sonnet by default. Opus only when the reasoning is hard or the decision is risky.
4. Big searches go to smaller, focused agents that return a short summary to the main session.
5. Multi-agent workflows only for large tasks. For a small change they are a waste.
6. Short project instructions and memory files, since they cost context in every session.
7. Review depth follows the risk: a quick focused review for normal changes, a deeper one for critical code.
8. Only the information the current task needs, nothing extra "just in case".
9. I check the output before continuing. Catching a mistake early is much cheaper than generating everything twice.
