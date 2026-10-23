interface Crumb {
  label: string;
  href?: string;
}

/** The last crumb is the current page and is not a link. */
export function Breadcrumb({ items }: { items: readonly Crumb[] }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} aria-current={isLast ? 'page' : undefined}>
              {item.href && !isLast ? <a href={item.href}>{item.label}</a> : item.label}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
