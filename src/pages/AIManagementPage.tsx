import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrafficMap } from '../components/map/TrafficMap';
import { MetricCard } from '../components/ui/MetricCard';
import { Panel } from '../components/ui/Panel';
import { getJunctionById } from '../data/trafficNetwork';
import { mockApi } from '../data/mockApi';
import { useTrafficStore } from '../store/useTrafficStore';

export function AIManagementPage() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Awaited<ReturnType<typeof mockApi.getRecommendations>>>([]);
  const selectedJunctionId = useTrafficStore((state) => state.selectedJunctionId);

  useEffect(() => {
    mockApi.getRecommendations().then(setRecommendations);
  }, []);

  const selectedJunction = getJunctionById(selectedJunctionId);
  const activeRecommendation = recommendations.find((item) => item.junctionId === selectedJunctionId) ?? recommendations[0];

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Recommended actions', value: `${recommendations.length || 3}`, detail: 'AI measures ready for review' },
          { label: 'Average confidence', value: '93%', detail: 'Inference consensus across modalities', tone: 'success' as const },
          { label: 'High severity plans', value: '2', detail: 'Requires operations approval', tone: 'warning' as const },
          { label: 'Forecast reduction', value: '29%', detail: 'Estimated congestion reduction if approved', tone: 'default' as const },
        ].map((item) => (
          <MetricCard key={item.label} {...item} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="AI traffic management engine" eyebrow="Decision support">
          <TrafficMap className="h-[760px]" />
        </Panel>

        <Panel
          title={selectedJunction ? `${selectedJunction.name} recommendations` : 'AI recommendation board'}
          eyebrow="Optimization output"
          action={
            <button
              type="button"
              onClick={() => navigate('/incident-response')}
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Notify Traffic Police
            </button>
          }
        >
          <div className="space-y-4">
            {(recommendations.length > 0 ? recommendations : Array.from({ length: 2 }, (_, index) => ({
              id: String(index),
              title: 'Pending optimization',
              action: 'AI model is loading live recommendation output.',
              mitigation: 'Awaiting telemetry sync.',
              signalTiming: 'TBD',
              confidence: 0,
              impactEstimate: 0,
              severity: 'medium' as const,
              junctionId: 'stadium_jn',
              approvalState: 'pending' as const,
            }))).map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{item.severity} severity</div>
                    <h3 className="mt-2 text-base font-semibold text-slate-950">{item.title}</h3>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.approvalState === 'approved' ? 'bg-emerald-50 text-emerald-700' : item.approvalState === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                    {item.approvalState}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.action}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.mitigation}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <MetricCard label="Signal timing" value={item.signalTiming} detail="Recommended cycle" />
                  <MetricCard label="AI confidence" value={`${Math.round(item.confidence * 100)}%`} detail="Model alignment" tone="success" />
                  <MetricCard label="Impact estimate" value={`${item.impactEstimate}%`} detail="Projected queue reduction" tone="warning" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
            The control logic is tuned to the Kozhikode corridor graph. Approval will hand over the active plan to the incident response console.
          </div>
        </Panel>
      </section>
    </div>
  );
}
