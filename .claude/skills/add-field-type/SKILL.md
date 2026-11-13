---
name: add-field-type
description: Add support for a new field type in the dynamic form (for example checkbox, radio, date, slider). Use when the server schema gains a field `type` the form does not render yet, or when asked to add a new kind of input to the form builder.
---

# Add a field type

A field type touches five places. Do them in this order, because each step makes the
next one a compile error until it is done.

Use `checkbox` below as the example name.

## 1. Schema: `src/features/dynamic-form/schema/formSchema.ts`

Add a Zod object with `...baseField`, a literal `type`, and its `props`. Add it to the
`fieldSchema` union. Export the inferred type from `schema/types.ts`.

If the field stores something other than a string or `File[]`, extend `FieldValue` in
`schema/types.ts`, then update `utils/defaultValues.ts` and `utils/toFormData.ts`.

## 2. Validation: `validation/validators.ts` and `validation/buildValidator.ts`

Write a pure validator `(value, field) => message | undefined`. Handle `required`
first. Add a `case` in `ruleFor`. The `never` check there fails the build until you do.

Put new messages in `constants/messages.ts`.

## 3. Design system: `src/design-system/components/`

Reuse an existing primitive if one fits. Otherwise add a new one:

- props extend the native element props
- styles in a CSS module that uses tokens only
- no knowledge of the form schema
- exported from `design-system/index.ts`

## 4. Field component: `components/fields/CheckboxField.tsx`

Copy the shape of `InputField.tsx`: `useId`, `useController`, `FieldShell`, the
design-system control, and `controlA11y` for the ARIA attributes. Then add a `case` in
`components/FieldRenderer.tsx`.

## 5. Mock and tests

- Add a field of the new type to `src/mocks/data/car-form.json` if the demo should show it.
- Add a builder to `src/test/factories.ts`.
- Unit-test the validator in `validation/validators.test.ts`.
- Add one component test that renders the field, triggers its error and submits a value.

## Done when

- `npm run check` passes.
- No file is over 100 lines.
- The new type is listed under "Supported field types" in `README.md`.
