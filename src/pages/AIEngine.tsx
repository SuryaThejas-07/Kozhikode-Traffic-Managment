import { useMemo } from 'react';
import { useTrafficStore } from '../store/traffic.store';
import { Panel } from '../components/ui/Panel';
import { Badge } from '../components/ui/Badge';
import { MetricCard } from '../components/ui/MetricCard';

export function AIEngine() {
  const recommendations = useTrafficStore((state) => state.recommendations);
  const previewRecommendation = useTrafficStore((state) => state.previewRecommendation);
  const approveRecommendation = useTrafficStore((state) => state.approveRecommendation);
  const rejectRecommendation = useTrafficStore((state) => state.rejectRecommendation);

  const cards = useMemo(() => recommendations.length > 0 ? recommendations : [
    { action: 'Increase green phase by 20 seconds', reduction_pct: 32, confidence: 0.96, priority: 'critical', status: 'pending', new_green_n: 42, new_green_s: 40, new_green_e: 18, new_green_w: 18 },
    { action: 'Divert traffic via alternate corridor', reduction_pct: 24, confidence: 0.9, priority: 'high', status: 'pending', new_green_n: 30, new_green_s: 30, new_green_e: 20, new_green_w: 20 },
    { action: 'Activate emergency priority mode', reduction_pct: 37, confidence: 0.98, priority: 'critical', status: 'pending', new_green_n: 50, new_green_s: 46, new_green_e: 16, new_green_w: 16 },
  ], [recommendations]);

  return (
    <div className="absolute inset-0 flex">
      <div className="w-[58%] min-w-0" />
      <div className="pointer-events-none w-[42%] p-3">
        <Panel title="AI Traffic Management Engine" subtitle="Decision support" className="pointer-events-auto h-[calc(100vh-96px)] overflow-y-auto">
          <div className="flex gap-2 border-b border-[var(--border)] pb-3 text-[12px]">
            {['All', 'Critical', 'Pending', 'Approved'].map((item) => (
              <button key={item} type="button" className="rounded-[6px] border border-[var(--border)] px-3 py-1">{item}</button>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {cards.map((item) => (
              <div key={item.action} className="rounded-[10px] border border-[var(--border)] p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">{item.priority}</div>
                    <div className="mt-1 text-[13px] font-medium">{item.action}</div>
                  </div>
                  <Badge tone={item.status === 'approved' ? 'success' : item.status === 'rejected' ? 'danger' : 'warn'}>{item.status}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <MetricCard label="Reduction" value={`${item.reduction_pct}%`} />
                  <MetricCard label="Confidence" value={`${Math.round(item.confidence * 100)}%`} />
                  <MetricCard label="Signal plan" value={`${item.new_green_n}/${item.new_green_s}/${item.new_green_e}/${item.new_green_w}`} />
                </div>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => previewRecommendation(item.action)} className="rounded-[6px] border border-[var(--border)] px-3 py-2 text-[12px]">Preview</button>
                  <button type="button" onClick={() => approveRecommendation(item.action)} className="rounded-[6px] border border-[var(--border)] px-3 py-2 text-[12px]">Approve</button>
                  <button type="button" onClick={() => rejectRecommendation(item.action)} className="rounded-[6px] border border-[var(--border)] px-3 py-2 text-[12px]">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
