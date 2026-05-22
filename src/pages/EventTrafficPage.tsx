import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TrafficMap } from '../components/map/TrafficMap';
import { MetricCard } from '../components/ui/MetricCard';
import { Panel } from '../components/ui/Panel';
import { events } from '../data/trafficNetwork';
import { mockApi } from '../data/mockApi';
import { useEventStore } from '../store/event.store';
import { selectEvent } from '../lib/trafficSelectors';
import { useTrafficStore } from '../store/useTrafficStore';

export function EventTrafficPage() {
  const eventList = useEventStore((s) => s.events);
  const addEvent = useEventStore((s) => s.addEvent);
  const selectedEventId = useTrafficStore((state) => state.selectedEventId);
  const setSelectedEventId = useTrafficStore((state) => state.setSelectedEventId);

  useEffect(() => {
    // hydrate from mock API once (keeps runtime in sync with data/trafficNetwork seed)
    mockApi.getEvents().then((items) => {
      // merge without duplicating ids
      items.forEach((it) => addEvent(it));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedEvent = selectEvent(eventList, selectedEventId);

  // Local UI state for add-event form/modal
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<{
    id: string;
    name: string;
    category: 'sports' | 'vip' | 'rally' | 'festival' | 'religious';
    venue: string;
    impactRadiusKm: number;
    attendance: number;
    startTime: string;
    endTime: string;
    state: 'scheduled' | 'live' | 'completed';
  }>({ id: '', name: '', category: 'sports', venue: '', impactRadiusKm: 1.0, attendance: 0, startTime: '', endTime: '', state: 'scheduled' });

  const onAdd = () => {
    if (!form.id || !form.name) return setError('Provide id and name');
    if (eventList.some((e) => e.id === form.id)) return setError('An event with this id already exists');
    // hydrate duplicate-safe
    addEvent({ ...form });
    setShowAdd(false);
    setForm({ id: '', name: '', category: 'sports', venue: '', impactRadiusKm: 1.0, attendance: 0, startTime: '', endTime: '', state: 'scheduled' });
  };
  const [error, setError] = useState<string | null>(null);
  const crowdSeries = [
    { zone: 'Gate A', crowd: 82, parking: 74, busLoad: 62 },
    { zone: 'Gate B', crowd: 68, parking: 58, busLoad: 70 },
    { zone: 'South lot', crowd: 44, parking: 82, busLoad: 39 },
    { zone: 'North corridor', crowd: 76, parking: 61, busLoad: 88 },
  ];

  return (
    <div className="pointer-events-auto space-y-5">
      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Planned events', value: `${eventList.length}`, detail: 'Live and scheduled special operations' },
          { label: 'Venue pressure', value: 'High', detail: 'Stadium Junction and corridor overlap', tone: 'warning' as const },
          { label: 'Parking overflow', value: '76%', detail: 'Requires temporary corridor control' },
          { label: 'Bus priority', value: 'Enabled', detail: 'Transit-first response mode', tone: 'success' as const },
        ].map((item) => (
          <MetricCard key={item.label} {...item} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <Panel title="Event traffic management" eyebrow="Special event operations">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[var(--muted)]">Interactive event map and operational controls.</div>
              <div className="space-x-2">
                <button type="button" onClick={() => setShowAdd(true)} className="rounded-full border px-3 py-1 text-sm">Add event</button>
              </div>
            </div>
            <div className="mt-3">
              <TrafficMap className="h-[520px] rounded-lg" />
            </div>
          </Panel>

        <div className="space-y-5">
          <Panel title="Event scenarios" eyebrow="Simulation control">
            <div className="space-y-3">
              {eventList.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => setSelectedEventId(event.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${event.id === selectedEventId ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{event.category}</p>
                      <h3 className="mt-2 text-base font-semibold text-slate-950">{event.name}</h3>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${event.state === 'live' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {event.state}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{event.venue}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Impact radius {event.impactRadiusKm} km · Attendance {event.attendance || 'flow only'}</p>
                </button>
              ))}
            </div>
          </Panel>

          {/* Add event modal - simple inline drawer */}
          {showAdd ? (
            <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowAdd(false)} />
              <div className="relative z-50 w-full max-w-xl p-4">
                <div className="rounded-lg border bg-white p-4 shadow-lg">
                  <h3 className="text-lg font-semibold">Add Event</h3>
                  <div className="mt-3 grid gap-2">
                    <input placeholder="id (unique)" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} className="border p-2" />
                    <input placeholder="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border p-2" />
                    <input placeholder="venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className="border p-2" />
                    <div className="flex gap-2">
                      <input type="datetime-local" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="border p-2 flex-1" />
                      <input type="datetime-local" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="border p-2 flex-1" />
                    </div>
                    <div className="flex items-center gap-2">
                      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })} className="border p-2">
                        <option value="sports">sports</option>
                        <option value="vip">vip</option>
                        <option value="rally">rally</option>
                        <option value="festival">festival</option>
                      </select>
                      <input type="number" placeholder="attendance" value={form.attendance} onChange={(e) => setForm({ ...form, attendance: Number(e.target.value) })} className="border p-2 w-36" />
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      <button type="button" onClick={() => setShowAdd(false)} className="rounded border px-3 py-1">Cancel</button>
                      <button type="button" onClick={onAdd} className="rounded bg-blue-600 px-3 py-1 text-white">Add</button>
                    </div>
                    {error ? <div className="mt-2 text-sm text-red-600">{error}</div> : null}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <Panel title={selectedEvent?.name ?? 'Event overview'} eyebrow="Operational simulation">
            <div className="grid gap-4 md:grid-cols-2">
              <MetricCard label="Crowd movement" value="Forecasted" detail="Arrival wave front mapped to transit release" />
              <MetricCard label="Parking overflow" value="High risk" detail="Temporary overflow zone required" tone="warning" />
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              Event-specific traffic pressure is propagated to event-sensitive corridors, shaping lane splits, bus prioritization, and diversion timing.
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Activate diversion plan</button>
              <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Prioritize buses</button>
              <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Simulate parking overflow</button>
            </div>
          </Panel>

          <Panel title="Crowd and parking outlook" eyebrow="Simulation outputs">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={crowdSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="zone" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="crowd" fill="#2563eb" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="parking" fill="#0f766e" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="busLoad" fill="#f97316" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
}
