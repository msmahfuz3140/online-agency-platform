import { forwardRef } from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div" | "article" | "main";
  /** Full-width background; inner content is max-width constrained */
  contained?: boolean;
  /** Extra vertical spacing */
  spacious?: boolean;
  children: React.ReactNode;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  function Section(
    { as: Tag = "section", contained = true, spacious = false, children, className = "", ...props },
    ref
  ) {
    const outer = `w-full ${spacious ? "py-24 md:py-32" : "py-16 md:py-24"} ${className}`;
    const inner = contained
      ? "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      : "";

    return (
      // @ts-expect-error — dynamic tag
      <Tag ref={ref} className={outer} {...props}>
        {contained ? <div className={inner}>{children}</div> : children}
      </Tag>
    );
  }
);

Section.displayName = "Section";
