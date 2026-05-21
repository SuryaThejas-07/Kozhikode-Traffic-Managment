import { useState } from 'react';
import { Panel } from '../components/ui/Panel';
import { MetricCard } from '../components/ui/MetricCard';
import { useEventStore } from '../store/event.store';
import { useTrafficStore } from '../store/traffic.store';

export function Events() {
  const events = useEventStore((state) => state.events);
  const drawerOpen = useEventStore((state) => state.drawerOpen);
  const setDrawerOpen = useEventStore((state) => state.setDrawerOpen);
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id ?? '');
  const setSelectedEventIdGlobal = useTrafficStore((state) => state.setSelectedEventId);

  return (
    <div className="absolute inset-0 p-3">
      <div className="pointer-events-none flex h-full gap-3">
        <div className="pointer-events-auto flex gap-2 overflow-x-auto rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-2">
          {events.map((event) => (
            <button key={event.id} type="button" onClick={() => { setSelectedEventId(event.id); setSelectedEventIdGlobal(event.id); }} className={`rounded-[6px] border px-3 py-2 text-[12px] ${selectedEventId === event.id ? 'border-[var(--accent)]' : 'border-[var(--border)]'}`}>
              {event.name}
            </button>
          ))}
          <button type="button" onClick={() => setDrawerOpen(!drawerOpen)} className="rounded-[6px] border border-[var(--border)] px-3 py-2 text-[12px]">+ New Event</button>
        </div>
      </div>

      {drawerOpen && (
        <div className="pointer-events-auto absolute right-3 top-14 bottom-14 w-[320px] rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-4">
          <Panel title="Create Event" subtitle="Sliding drawer">
            <MetricCard label="Venue" value="Stadium Junction" detail="Venue node selector" />
            <MetricCard label="Crowd" value="32,000" detail="Radius updates from crowd size" />
          </Panel>
        </div>
      )}
    </div>
  );
}
