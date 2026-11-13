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

## Mocking with MSW

Requests are intercepted at the network level, so the application code is the same
code that will talk to the real backend. The handlers are shared by the browser
worker and the Node test server.

The alternative was json-server. It needs a second process, and it cannot receive a
multipart upload without custom middleware. Upload is the centre of this task.
