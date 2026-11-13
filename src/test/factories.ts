import {
  fileFieldSchema,
  inputFieldSchema,
  selectFieldSchema,
  textareaFieldSchema,
} from "@/features/dynamic-form/schema/formSchema";

/**
 * Field builders for tests. They go through the real Zod schemas, so a test
 * field has exactly the defaults and coercions a server field would get.
 */
type Overrides = { required?: boolean; props?: Record<string, unknown> };

export const textField = ({ required = false, props = {} }: Overrides = {}) =>
  inputFieldSchema.parse({
    type: "input",
    name: "brand",
    label: "Brand",
    required,
    props,
  });

export const numberField = ({ required = false, props = {} }: Overrides = {}) =>
  inputFieldSchema.parse({
    type: "input",
    name: "year",
    label: "Year",
    required,
    props: { type: "number", ...props },
  });

export const textareaField = ({
  required = false,
  props = {},
}: Overrides = {}) =>
  textareaFieldSchema.parse({
    type: "textarea",
    name: "notes",
    label: "Notes",
    required,
    props,
  });

export const selectField = ({ required = false, props = {} }: Overrides = {}) =>
  selectFieldSchema.parse({
    type: "select",
    name: "fuel",
    label: "Fuel",
    required,
    props: { options: [{ label: "Petrol", value: "petrol" }], ...props },
  });

export const fileField = ({ required = false, props = {} }: Overrides = {}) =>
  fileFieldSchema.parse({
    type: "file",
    name: "images",
    label: "Images",
    required,
    props,
  });
