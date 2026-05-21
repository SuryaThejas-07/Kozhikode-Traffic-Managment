export function MetricCard({ label, value, detail, tone = 'default' }: { label: string; value: string; detail?: string; tone?: 'default' | 'success' | 'warn' | 'danger' }) {
  const toneClass = tone === 'success' ? 'text-[var(--success)]' : tone === 'warn' ? 'text-[var(--warn)]' : tone === 'danger' ? 'text-[var(--danger)]' : 'text-[var(--accent)]';
  return (
    <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">{label}</div>
      <div className={`mt-2 text-[24px] font-medium tabular-nums ${toneClass}`}>{value}</div>
      {detail ? <div className="mt-2 text-[12px] leading-5 text-[var(--muted)]">{detail}</div> : null}
    </div>
  );
}
