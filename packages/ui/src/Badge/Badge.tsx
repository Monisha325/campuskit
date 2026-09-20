import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Badge.module.scss";

export type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: BadgeTone;
};

export function Badge({ children, tone = "neutral", className, ...props }: BadgeProps) {
  return <span className={[styles.badge, styles[tone], className].filter(Boolean).join(" ")} {...props}>{children}</span>;
}
