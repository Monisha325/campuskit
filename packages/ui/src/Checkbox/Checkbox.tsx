import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import styles from "./Checkbox.module.scss";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type"> & {
  description?: ReactNode;
  error?: ReactNode;
  id?: string;
  label: ReactNode;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, className, description, error, id, label, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;
  const describedBy = [ariaDescribedBy, description && descriptionId, error && errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>
        <input
          aria-describedby={describedBy}
          aria-invalid={error ? true : ariaInvalid}
          className={[styles.control, error && styles.invalid, className].filter(Boolean).join(" ")}
          id={inputId}
          ref={ref}
          type="checkbox"
          {...props}
        />
        <span>{label}</span>
      </label>
      {description && <span className={styles.description} id={descriptionId}>{description}</span>}
      {error && <span className={styles.error} id={errorId} role="alert">{error}</span>}
    </div>
  );
});
