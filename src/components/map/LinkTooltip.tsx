export function LinkTooltip({ title, body, x, y }: { title: string; body: string; x: number; y: number }) {
  return (
    <div style={{ left: x + 14, top: y + 14 }} className="pointer-events-none absolute z-30 max-w-[260px] rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[12px] text-[var(--text)]">
      <div className="font-medium">{title}</div>
      <div className="mt-1 text-[11px] leading-5 text-[var(--muted)]">{body}</div>
    </div>
  );
}
