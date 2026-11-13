import type { ChangeEvent, ComponentProps } from "react";
import { Upload } from "lucide-react";
import { mergeFiles } from "./mergeFiles";
import { SelectedFileList } from "./SelectedFileList";
import styles from "./FileUpload.module.css";

type NativeProps = Omit<
  ComponentProps<"input">,
  "type" | "value" | "onChange" | "multiple"
>;

export interface FileUploadProps extends NativeProps {
  id: string;
  /** Controlled list of files: the parent form owns the state. */
  value: readonly File[];
  onChange: (files: File[]) => void;
  multiple?: boolean;
  triggerLabel: string;
  removeLabel: (fileName: string) => string;
}

/**
 * Controlled file picker. The native input stays in the DOM (visually hidden) so
 * the OS dialog, `accept` filtering and keyboard access keep working; the list
 * below makes the selection visible and editable, which a bare input cannot do.
 */
export function FileUpload({
  id,
  value,
  onChange,
  multiple = false,
  triggerLabel,
  removeLabel,
  disabled,
  ...rest
}: FileUploadProps) {
  const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(mergeFiles(value, Array.from(event.target.files ?? []), multiple));
    // Clear the native value so choosing the same file again still fires `change`.
    event.target.value = "";
  };

  return (
    <div className={styles.root}>
      <input
        {...rest}
        id={id}
        type="file"
        className={styles.input}
        multiple={multiple}
        disabled={disabled}
        onChange={handleSelect}
      />
      <label htmlFor={id} className={styles.trigger}>
        <Upload size={18} aria-hidden="true" />
        {triggerLabel}
      </label>
      <SelectedFileList
        files={value}
        onRemove={(index) =>
          onChange(value.filter((_, position) => position !== index))
        }
        removeLabel={removeLabel}
        disabled={disabled}
      />
    </div>
  );
}
