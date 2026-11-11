interface TocProps {
  items: { href: string; label: string }[];
}

export function Toc({ items }: TocProps) {
  const half = Math.ceil(items.length / 2);
  const columns = [items.slice(0, half), items.slice(half)];
  return (
    <nav
      aria-label="Contents"
      className="font-ui text-ink-muted mb-8 grid grid-cols-2 gap-x-4 gap-y-1 text-sm"
    >
      {columns.map((column) => (
        <div key={column.map((item) => item.href).join('|')}>
          {column.map((item) => (
            <div key={item.href}>
              <a href={item.href} className="hover:text-ink-soft transition-colors">
                {item.label}
              </a>
            </div>
          ))}
        </div>
      ))}
    </nav>
  );
}
