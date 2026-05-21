import { formatClock } from '../../lib/format';

interface TopBarProps {
  timestamp: Date;
  networkLabel: string;
  summary: string;
}

export function TopBar({ timestamp, networkLabel, summary }: TopBarProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">Operational status bar</p>
        <h2 className="mt-1 text-lg font-semibold text-slate-950">{networkLabel}</h2>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold text-slate-700">{summary}</div>
        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700">
          Live clock {formatClock(timestamp)} IST
        </div>
      </div>
    </header>
  );
}
