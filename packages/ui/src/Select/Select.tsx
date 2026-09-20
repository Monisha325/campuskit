import { forwardRef, useId, type ReactNode, type SelectHTMLAttributes } from "react";
import styles from "./Select.module.scss";

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> & {
  children: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  id?: string;
  label: ReactNode;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, children, className, description, error, id, label, ...props },
  ref
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const descriptionId = `${selectId}-description`;
  const errorId = `${selectId}-error`;
  const describedBy = [ariaDescribedBy, description && descriptionId, error && errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={selectId}>{label}</label>
      <select
        aria-describedby={describedBy}
        aria-invalid={error ? true : ariaInvalid}
        className={[styles.control, error && styles.invalid, className].filter(Boolean).join(" ")}
        id={selectId}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      {description && <span className={styles.description} id={descriptionId}>{description}</span>}
      {error && <span className={styles.error} id={errorId} role="alert">{error}</span>}
    </div>
  );
});
