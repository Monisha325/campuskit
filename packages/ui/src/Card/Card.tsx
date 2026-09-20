import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Card.module.scss";

export type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  footer?: ReactNode;
  heading?: ReactNode;
  headingLevel?: "h1" | "h2" | "h3" | "h4";
};

export function Card({ children, footer, heading, headingLevel: Heading = "h2", className, ...props }: CardProps) {
  return (
    <article className={[styles.card, className].filter(Boolean).join(" ")} {...props}>
      {heading && <Heading className={styles.heading}>{heading}</Heading>}
      <div className={styles.body}>{children}</div>
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </article>
  );
}
