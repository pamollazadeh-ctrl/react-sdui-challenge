import { X } from "lucide-react";
import { formatFileSize } from "@/lib/fileSize";
import styles from "./FileUpload.module.css";

interface SelectedFileListProps {
  files: readonly File[];
  onRemove: (index: number) => void;
  /** Builds the accessible name of a remove button, e.g. "Remove photo.png". */
  removeLabel: (fileName: string) => string;
  disabled?: boolean | undefined;
}

/** The files currently held by a `FileUpload`, each with its own remove button. */
export function SelectedFileList({
  files,
  onRemove,
  removeLabel,
  disabled,
}: SelectedFileListProps) {
  if (files.length === 0) return null;

  return (
    <ul className={styles.list}>
      {files.map((file, index) => (
        <li
          key={`${file.name}-${file.size}-${file.lastModified}`}
          className={styles.item}
        >
          <span className={styles.name} dir="auto">
            {file.name}
          </span>
          <span className={styles.size} dir="ltr">
            {formatFileSize(file.size)}
          </span>
          <button
            type="button"
            className={styles.remove}
            onClick={() => onRemove(index)}
            aria-label={removeLabel(file.name)}
            disabled={disabled}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}
