import { useEffect, useState } from 'react';
import { MetricCard } from '../components/ui/MetricCard';
import { Panel } from '../components/ui/Panel';
import { mockApi } from '../data/mockApi';
import { SystemMetric } from '../types/traffic';

export function SystemMonitoringPage() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);

  useEffect(() => {
    mockApi.getSystemMetrics().then(setMetrics);
  }, []);

  const pipeline = [
    { label: 'IoT sensors', status: 'good', value: '97.8%' },
    { label: 'CCTV inference', status: 'good', value: '18 active' },
    { label: 'AI prediction API', status: 'good', value: '84 ms' },
    { label: 'Cloud sync', status: 'warning', value: '1.6 s lag' },
  ] as const;

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'ML service', value: 'Healthy', detail: 'Prediction and anomaly scoring online', tone: 'success' as const },
          { label: 'Edge devices', value: '31/32', detail: 'One sensor node in degraded mode', tone: 'warning' as const },
          { label: 'Cloud sync', value: 'Nominal', detail: 'Object store replication stable' },
          { label: 'Alerting', value: 'Connected', detail: 'Police and response channels live' },
        ].map((item) => (
          <MetricCard key={item.label} {...item} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Panel title="System monitoring" eyebrow="Operational health">
          <div className="grid gap-4 md:grid-cols-2">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{metric.label}</div>
                    <div className="mt-2 text-2xl font-semibold text-slate-950">{metric.value}</div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${metric.status === 'good' ? 'bg-emerald-50 text-emerald-700' : metric.status === 'warning' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                    {metric.status}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{metric.detail}</p>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel title="Data ingestion pipeline" eyebrow="Infrastructure flow">
            <div className="space-y-3">
              {pipeline.map((stage, index) => (
                <div key={stage.label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${stage.status === 'good' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-950">{stage.label}</p>
                    <p className="text-sm text-slate-600">{stage.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="System snapshot" eyebrow="Control room telemetry">
            <div className="space-y-4 text-sm leading-6 text-slate-600">
              <p>The monitoring page tracks model latency, sensor health, cloud sync, and CCTV stream status in a format suitable for a smart city operations room.</p>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Current stance</p>
                <p className="mt-2">All core control-plane services are available. The sync queue is the only item carrying a warning state.</p>
              </div>
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
}
