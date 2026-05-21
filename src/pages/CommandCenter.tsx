import { useMemo } from 'react';
import { useTrafficStore } from '../store/traffic.store';
import { useIncidentStore } from '../store/incident.store';
import { Panel } from '../components/ui/Panel';
import { MetricCard } from '../components/ui/MetricCard';
import { Badge } from '../components/ui/Badge';
import { NODES } from '../data/nodes';
import { LINKS } from '../data/links';

export function CommandCenter() {
  const layers = useTrafficStore((state) => state.layers);
  const toggleLayer = useTrafficStore((state) => state.toggleLayer);
  const nodeStates = useTrafficStore((state) => state.nodeStates);
  const incidents = useIncidentStore((state) => state.incidents);
  const selectedNodeId = useTrafficStore((state) => state.selectedNodeId);
  const selectedNode = nodeStates[selectedNodeId] ?? nodeStates[Object.keys(nodeStates)[0]];

  const signalGrid = useMemo(() => NODES.map((node) => ({ node, state: nodeStates[node.id] })), [nodeStates]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="pointer-events-none absolute left-3 top-3 bottom-16 w-[280px] space-y-3 overflow-y-auto pr-1">
        <Panel title="KUTIS" subtitle="Kozhikode Urban Traffic Intelligence System" className="pointer-events-auto">
          <div className="text-[12px] leading-5 text-[var(--muted)]">Production traffic command center. Real data geometry. No decorative effects.</div>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
            <Badge tone="accent">v1.0</Badge>
            <Badge tone="success">Live</Badge>
            <Badge tone="warn">ST-GNN</Badge>
          </div>
        </Panel>

        <Panel title="Layers" subtitle="Visibility controls" className="pointer-events-auto">
          <div className="space-y-2">
            {Object.entries(layers).map(([key, enabled]) => (
              <button key={key} type="button" onClick={() => toggleLayer(key as keyof typeof layers)} className="flex w-full items-center justify-between rounded-[6px] border border-[var(--border)] px-3 py-2 text-[12px]">
                <span>{key}</span>
                <span className={`h-2.5 w-2.5 rounded-full ${enabled ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} />
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Weather" subtitle="City conditions" className="pointer-events-auto">
          <div className="text-[12px] leading-6 text-[var(--muted)]">
            Kozhikode
            <br />
            31°C · humid · light haze
            <br />
            24h format · live operational view
          </div>
        </Panel>

        <Panel title="Network stats" subtitle="Quick view" className="pointer-events-auto">
          <div className="grid gap-2">
            <MetricCard label="Nodes" value={`${NODES.length}`} detail="Exact corridor graph" />
            <MetricCard label="Links" value={`${LINKS.length}`} detail="Directed road segments" />
            <MetricCard label="Selected node" value={selectedNodeId} detail={`Queue ${selectedNode?.q_n ?? 0}/${selectedNode?.q_s ?? 0}/${selectedNode?.q_e ?? 0}/${selectedNode?.q_w ?? 0}`} />
          </div>
        </Panel>
      </div>

      <div className="pointer-events-none absolute right-3 top-3 bottom-16 w-[320px] space-y-3 overflow-y-auto pr-1">
        <Panel title={`Live Incidents (${incidents.length})`} subtitle="Operational alerts" className="pointer-events-auto">
          <div className="space-y-2">
            {incidents.map((incident) => (
              <div key={incident.id} className="rounded-[6px] border border-[var(--border)] p-3">
                <div className="flex items-center gap-2 text-[12px] font-medium">
                  <span className={`h-2 w-2 rounded-full ${incident.severity === 'critical' ? 'bg-[var(--danger)]' : incident.severity === 'high' ? 'bg-[var(--warn)]' : 'bg-[var(--accent)]'}`} />
                  {incident.title}
                </div>
                <div className="mt-1 text-[11px] text-[var(--muted)]">{incident.note}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="AI Queue" subtitle="Pending measures" className="pointer-events-auto">
          <div className="space-y-2">
            {['Increase green phase by 20 seconds', 'Divert traffic via alternate corridor', 'Activate emergency priority mode'].map((item) => (
              <div key={item} className="rounded-[6px] border border-[var(--border)] p-3 text-[12px] leading-5">
                <div className="flex items-center justify-between gap-2">
                  <span>{item}</span>
                  <Badge tone="warn">Pending</Badge>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Signal Grid" subtitle={`${NODES.length} nodes`} className="pointer-events-auto">
          <div className="grid grid-cols-3 gap-2">
            {signalGrid.map(({ node, state }) => (
              <div key={node.id} className="rounded-[6px] border border-[var(--border)] p-2 text-[11px] leading-4">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${state.phase === 'green' ? 'bg-[var(--success)]' : state.phase === 'amber' ? 'bg-[var(--warn)]' : 'bg-[var(--danger)]'}`} />
                  <span className="truncate">{node.id}</span>
                </div>
                <div className="mt-1 text-[10px] text-[var(--muted)] tabular-nums">{state.phase_remaining}s</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="pointer-events-none absolute left-1/2 bottom-18 w-[min(820px,calc(100vw-620px))] -translate-x-1/2 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-3 text-[12px]">
        Selected node: {selectedNodeId} · Phase {selectedNode?.phase?.toUpperCase()} · Queue {selectedNode?.q_n}/{selectedNode?.q_s}/{selectedNode?.q_e}/{selectedNode?.q_w}
      </div>
    </div>
  );
}
