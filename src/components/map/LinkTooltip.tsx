export function LinkTooltip({ title, body, x, y }: { title: string; body: string; x: number; y: number }) {
  return (
    <div style={{ left: x + 14, top: y + 14 }} className="pointer-events-none absolute z-30 max-w-[280px] rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[13px] text-[var(--text)] shadow-lg shadow-black/10">
      <div className="text-[14px] font-semibold leading-5">{title}</div>
      <div className="mt-1 text-[12px] leading-5 text-[var(--muted)]">{body}</div>
    </div>
  );
}
