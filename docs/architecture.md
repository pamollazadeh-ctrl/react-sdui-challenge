# Architecture

Why the code is shaped the way it is. Each section is one decision.

## Layers

```
app  ->  features/dynamic-form  ->  design-system  ->  lib
                |
                +-> mocks (tests and dev only)
```

An arrow means "may import from". Nothing imports upwards. The design system knows
nothing about forms from a server, and the feature knows nothing about CSS.

## Where the design system plugs in

`src/design-system` has three parts:

- `styles/tokens.css`: colours, spacing, radius, type and control heights as CSS
  variables. Components use only these variables.
- `components/`: `TextInput`, `TextArea`, `SelectBox`, `FileUpload`, `FieldShell`,
  `Button`, `Alert`. Each has its own CSS module.
- `index.ts`: the public surface. Features import from `@/design-system` only.

The server schema meets the design system in one place: the field components in
`features/dynamic-form/components/fields/`. Each one translates a schema field into
props of a design-system component. For example `props.size: "large"` becomes the
`size` prop of `TextInput`, which maps to a height token.

The server also sends raw inline styles (`margin`, `padding`, `borderRadius`).
`utils/fieldStyle.ts` applies them through an allow-list. A schema can adjust
spacing, but it cannot set `position` or `display` and break the layout.

## The schema is validated at the boundary

`schema/formSchema.ts` describes the response with Zod, and the TypeScript types are
inferred from it. Inside the app every field is fully typed and has its defaults.
Nothing downstream checks for a missing `props` or a number that is a string.

One malformed field does not fail the whole form. The envelope is parsed strictly,
and each field is parsed on its own and skipped if it is invalid.

## Validation: pure functions wrapped in Zod

`validation/validators.ts` holds plain functions of the form
`(value, field) => message | undefined`. `buildValidator.ts` wraps them in Zod types
so React Hook Form can run them through its resolver.

The split keeps the rules free of any form library, and their tests need no
rendering. The client rules mirror what the server enforces. They do not replace it:
the mock backend also checks required fields and answers `422`.

## Mapping a type to a component

`FieldRenderer` is a `switch` on `field.type` with a `never` check in the default
branch. Compared with a lookup object, TypeScript narrows the field for each
component with no casts, and a new type that is not handled fails the build.

## Form state

React Hook Form keeps the values. Each field component subscribes with
`useController`, so typing in one field does not re-render the others. All behaviour
lives in `useDynamicForm`. `DynamicForm` only renders.

File fields hold a `File[]` in form state. The native input is cleared after each
selection, so the visible list is the single source of truth and the same file can
be picked again after it was removed.

## Loading state

`useFormSchema` returns a discriminated union: `loading`, `error` or `success` with
the schema. Impossible combinations, such as an error together with a schema, cannot
be represented. The request is aborted on unmount.

## Mocking with MSW

Requests are intercepted at the network level, so the application code is the same
code that will talk to the real backend. The handlers are shared by the browser
worker and the Node test server.

The alternative was json-server. It needs a second process, and it cannot receive a
multipart upload without custom middleware. Upload is the centre of this task.

## Messages

All user-facing text is in `constants/messages.ts`. The UI is Persian and
right-to-left. Layout uses logical CSS properties (`margin-inline`, `text-align:
start`), so it follows the document direction.

## Trade-offs

- **Light theme only.** The schema sends absolute text colours (`#000000`), which
  would be unreadable on a dark surface.
- **Native `<select>` and file input.** They bring keyboard, screen-reader and mobile
  behaviour for free. The price is less control over their look.
- **No data-fetching library.** There is one GET and one POST. A small hook is
  easier to read than a cache layer for this size.
- **`cols` on a textarea is ignored.** Controls are always full width so the form
  stays responsive.
