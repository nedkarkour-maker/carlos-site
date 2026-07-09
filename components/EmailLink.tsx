"use client";

import { site } from "@/config/content";

/**
 * A contact link that only becomes a mailto: when clicked. The address is
 * read from config inside this client component and assembled at click
 * time — passing a whole mailto: href down as a prop would embed it in
 * the server-rendered HTML (the RSC payload), which is exactly what email
 * scrapers harvest. Renders as a button styled by the caller.
 */
export default function EmailLink({
  subject,
  className,
  children,
}: {
  /** Optional prefilled subject line. */
  subject?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        const query = subject
          ? `?subject=${encodeURIComponent(subject)}`
          : "";
        window.location.href = `mailto:${site.contactEmail}${query}`;
      }}
    >
      {children}
    </button>
  );
}
