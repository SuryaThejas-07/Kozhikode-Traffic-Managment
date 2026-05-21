import { Panel } from '../components/ui/Panel';
import { MetricCard } from '../components/ui/MetricCard';
import { useIncidentStore } from '../store/incident.store';
import { useTrafficStore } from '../store/traffic.store';

export function Incidents() {
  const incidents = useIncidentStore((state) => state.incidents);
  const setSelectedIncidentId = useTrafficStore((state) => state.setSelectedIncidentId);

  return (
    <div className="absolute inset-0 flex gap-3 p-3">
      <div className="pointer-events-none w-[272px] min-w-0">
        <Panel title="Incidents" subtitle="Response queue" className="pointer-events-auto h-[calc(100vh-96px)] overflow-y-auto">
          <div className="space-y-2">
            {incidents.map((incident) => (
              <button key={incident.id} type="button" onClick={() => setSelectedIncidentId(incident.id)} className="w-full rounded-[6px] border border-[var(--border)] p-3 text-left text-[12px]">
                <div className="flex items-center gap-2">
                  <span className={`h-1 w-1 rounded-full ${incident.severity === 'critical' ? 'bg-[var(--danger)]' : incident.severity === 'high' ? 'bg-[var(--warn)]' : 'bg-[var(--accent)]'}`} />
                  <span>{incident.title}</span>
                </div>
                <div className="mt-1 text-[11px] text-[var(--muted)]">{incident.note}</div>
              </button>
            ))}
          </div>
        </Panel>
      </div>

      <div className="flex-1 min-w-0" />

      <div className="pointer-events-none w-[272px] min-w-0">
        <Panel title="Control Panel" subtitle="Override and broadcast" className="pointer-events-auto h-[calc(100vh-96px)] overflow-y-auto">
          <MetricCard label="Officers" value="6 on duty" />
          <MetricCard label="Broadcast" value="Ready" detail="Editable message queue" />
        </Panel>
      </div>
    </div>
  );
}
