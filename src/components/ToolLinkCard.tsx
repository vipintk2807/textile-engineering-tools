interface ToolLinkCardProps {
  title: string;
  description: string;
  href: string;
}

/** Card on the Home and category screens that links to one calculator. */
export function ToolLinkCard({ title, description, href }: ToolLinkCardProps) {
  return (
    <article className="panel tool-card">
      <h3>
        <a href={href}>{title}</a>
      </h3>
      <p className="tool-card__description">{description}</p>
    </article>
  );
}
