import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import styles from "./Input.module.scss";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  description?: ReactNode;
  error?: ReactNode;
  id?: string;
  label: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
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
      <label className={styles.label} htmlFor={inputId}>{label}</label>
      <input
        aria-describedby={describedBy}
        aria-invalid={error ? true : ariaInvalid}
        className={[styles.control, error && styles.invalid, className].filter(Boolean).join(" ")}
        id={inputId}
        ref={ref}
        {...props}
      />
      {description && <span className={styles.description} id={descriptionId}>{description}</span>}
      {error && <span className={styles.error} id={errorId} role="alert">{error}</span>}
    </div>
  );
});
