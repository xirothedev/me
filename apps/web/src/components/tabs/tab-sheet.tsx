const CHORD = /^[A-G][#b]?(?:maj|min|m|dim|aug|sus|add)?\d*(?:\/[A-G][#b]?)?$/;

interface TabSheetProps {
  text: string;
}

export function TabSheet({ text }: TabSheetProps) {
  return (
    <div className="font-code text-ink overflow-x-auto text-[13px] leading-[1.6] whitespace-pre">
      {linesWithKeys(text).map((line) => (
        <TabLine key={line.key} line={line.value} />
      ))}
    </div>
  );
}

function linesWithKeys(text: string): { key: string; value: string }[] {
  const seen = new Map<string, number>();
  return text.split('\n').map((value) => {
    const count = (seen.get(value) ?? 0) + 1;
    seen.set(value, count);
    return { key: `${value}#${count}`, value };
  });
}

function segmentsWithKeys(line: string): { key: string; value: string }[] {
  let position = 0;
  return line.split(/(\s+)/).map((value) => {
    const key = `${position}`;
    position += 1;
    return { key, value };
  });
}

function TabLine({ line }: { line: string }) {
  const trimmed = line.trim();
  if (!trimmed) return <div className="h-4" />;
  if (/^\[.+\]$/.test(trimmed)) {
    return <div className="text-ink-strong mt-5 mb-1 font-semibold first:mt-0">{trimmed}</div>;
  }

  const tokens = trimmed.split(/\s+/);
  if (tokens.every((token) => CHORD.test(token))) {
    return (
      <div className="mt-1 whitespace-pre">
        {segmentsWithKeys(line).map((part) =>
          CHORD.test(part.value) ? (
            <span
              key={part.key}
              className="text-ink-strong inline-block rounded-sm bg-neutral-200/70 font-semibold dark:bg-neutral-700/70"
            >
              {part.value}
            </span>
          ) : (
            <span key={part.key}>{part.value}</span>
          ),
        )}
      </div>
    );
  }

  return <div className="whitespace-pre">{line}</div>;
}
