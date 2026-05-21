import { useEffect, useMemo, useState } from 'react';
import { EmptyState } from '../components/ui/EmptyState';
import { Panel } from '../components/ui/Panel';
import { MetricCard } from '../components/ui/MetricCard';
import { SkeletonCard } from '../components/ui/Skeleton';
import { mockApi } from '../data/mockApi';
import { selectIncident } from '../lib/trafficSelectors';
import { useIncidentStore } from '../store/incident.store';
import { useTrafficStore } from '../store/traffic.store';

export function Incidents() {
  const incidents = useIncidentStore((state) => state.incidents);
  const setIncidents = useIncidentStore((state) => state.setIncidents);
  const setSelectedIncidentId = useTrafficStore((state) => state.setSelectedIncidentId);
  const selectedIncidentId = useTrafficStore((state) => state.selectedIncidentId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    mockApi.getIncidents().then((items) => {
      if (mounted) {
        setIncidents(items);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [setIncidents]);

  const selectedIncident = useMemo(() => selectIncident(incidents, selectedIncidentId), [incidents, selectedIncidentId]);

  return (
    <div className="absolute inset-0 flex gap-3 p-3">
      <div className="pointer-events-none w-[272px] min-w-0">
        <Panel title="Incidents" subtitle="Response queue" className="pointer-events-auto h-[calc(100vh-96px)] overflow-y-auto">
          <div className="space-y-2">
            {loading ? (
              <div className="space-y-2">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : incidents.length === 0 ? (
              <EmptyState title="No active incidents" description="The response queue is empty right now." />
            ) : (
              incidents.map((incident) => (
                <button
                  key={incident.id}
                  type="button"
                  onClick={() => setSelectedIncidentId(incident.id)}
                  className={`w-full rounded-[6px] border p-3 text-left text-[12px] ${selectedIncident?.id === incident.id ? 'border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_8%,transparent)]' : 'border-[var(--border)]'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${incident.severity === 'critical' ? 'bg-[var(--danger)]' : incident.severity === 'high' ? 'bg-[var(--warn)]' : 'bg-[var(--accent)]'}`} />
                    <span>{incident.title}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-[var(--muted)]">{incident.note}</div>
                </button>
              ))
            )}
          </div>
        </Panel>
      </div>

      <div className="flex-1 min-w-0" />

      <div className="pointer-events-none w-[272px] min-w-0">
        <Panel title="Control Panel" subtitle="Override and broadcast" className="pointer-events-auto h-[calc(100vh-96px)] overflow-y-auto">
          <MetricCard label="Officers" value="6 on duty" />
          <MetricCard label="Broadcast" value="Ready" detail="Editable message queue" />
          <div className="mt-4 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] p-3 text-[12px] text-[var(--muted)]">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">Selected incident</div>
            <div className="mt-1 font-medium text-[var(--text)]">{selectedIncident?.title ?? 'None selected'}</div>
            <div className="mt-1">{selectedIncident?.note ?? 'Choose an incident to load the response details.'}</div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
