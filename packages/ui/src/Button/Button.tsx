import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.scss";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: ReactNode;
  /** Decorative icon rendered before the label. Give the icon itself aria-hidden. */
  leadingIcon?: ReactNode;
  /** Decorative icon rendered after the label. Give the icon itself aria-hidden. */
  trailingIcon?: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export function Button({
  children,
  className,
  disabled,
  leadingIcon,
  loading = false,
  loadingLabel = "Loading",
  size = "md",
  trailingIcon,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      aria-busy={loading || undefined}
      className={[styles.button, styles[variant], styles[size], className].filter(Boolean).join(" ")}
      disabled={isDisabled}
      type={type}
      {...props}
    >
      {loading ? <span aria-hidden="true" className={styles.spinner} /> : leadingIcon}
      <span>{loading ? loadingLabel : children}</span>
      {!loading && trailingIcon}
    </button>
  );
}
