import type { CSSProperties, HTMLAttributes } from "react";
import styles from "./Skeleton.module.scss";

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  /** Uses a semantic status announcement only when loading text is supplied. */
  label?: string;
  variant?: "text" | "circle" | "rectangle";
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  animated?: boolean;
};

export function Skeleton({
  label,
  variant = "text",
  width,
  height,
  animated = true,
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-label={label}
      aria-live={label ? "polite" : undefined}
      aria-busy={label ? true : undefined}
      className={[styles.skeleton, styles[variant], animated && styles.animated, className].filter(Boolean).join(" ")}
      role={label ? "status" : undefined}
      style={{ width, height, ...style }}
      {...props}
    />
  );
}
