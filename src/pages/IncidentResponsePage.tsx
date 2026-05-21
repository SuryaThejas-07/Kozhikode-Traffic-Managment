import { useEffect, useState } from 'react';
import { TrafficMap } from '../components/map/TrafficMap';
import { MetricCard } from '../components/ui/MetricCard';
import { Panel } from '../components/ui/Panel';
import { incidents, signalPlans } from '../data/trafficNetwork';
import { mockApi } from '../data/mockApi';
import { useTrafficStore } from '../store/useTrafficStore';
import { formatDateLong } from '../lib/format';

export function IncidentResponsePage() {
  const [incidentList, setIncidentList] = useState(incidents);
  const [selectedSeverity, setSelectedSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [green, setGreen] = useState(20);
  const [amber, setAmber] = useState(5);
  const [red, setRed] = useState(75);
  const selectedIncidentId = useTrafficStore((state) => state.selectedIncidentId);
  const setSelectedIncidentId = useTrafficStore((state) => state.setSelectedIncidentId);

  useEffect(() => {
    mockApi.getIncidents().then(setIncidentList);
  }, []);

  const activeIncident = incidentList.find((incident) => incident.id === selectedIncidentId) ?? incidentList[0];
  const selectedPlan = signalPlans.find((plan) => plan.junctionId === activeIncident?.junctionId);

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Escalated incidents', value: `${incidentList.filter((incident) => incident.severity !== 'low').length}`, detail: 'Police and response review queue' },
          { label: 'Manual overrides', value: '1 armed', detail: 'Signal controller override ready', tone: 'warning' as const },
          { label: 'Emergency routing', value: 'Active', detail: 'Priority lane guidance enabled', tone: 'success' as const },
          { label: 'Broadcasts sent', value: '12', detail: 'Dispatch, field teams, and control room notifications' },
        ].map((item) => (
          <MetricCard key={item.label} {...item} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Incident response and police coordination" eyebrow="Emergency management">
          <TrafficMap className="h-[760px]" />
        </Panel>

        <div className="space-y-5">
          <Panel title="Incident queue" eyebrow="Escalation workflow">
            <div className="space-y-3">
              {incidentList.map((incident) => (
                <button
                  key={incident.id}
                  type="button"
                  onClick={() => setSelectedIncidentId(incident.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${incident.id === selectedIncidentId ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{incident.severity} severity</p>
                      <h3 className="mt-2 text-base font-semibold text-slate-950">{incident.title}</h3>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${incident.status === 'closed' ? 'bg-emerald-50 text-emerald-700' : incident.status === 'mitigated' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                      {incident.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{incident.location}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{incident.description}</p>
                </button>
              ))}
            </div>
          </Panel>

          {activeIncident ? (
            <Panel title={activeIncident.title} eyebrow="Signal intervention">
              <div className="space-y-4 text-sm text-slate-600">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p><span className="font-semibold text-slate-900">Location:</span> {activeIncident.location}</p>
                  <p className="mt-2"><span className="font-semibold text-slate-900">Reported:</span> {formatDateLong(activeIncident.reportedAt)}</p>
                  <p className="mt-2"><span className="font-semibold text-slate-900">ETA to mitigation:</span> {activeIncident.etaMinutes} minutes</p>
                </div>

                <div>
                  <div className="control-label">Severity tagging</div>
                  <div className="mt-3 flex gap-2">
                    {(['low', 'medium', 'high', 'critical'] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSelectedSeverity(level)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold capitalize transition ${selectedSeverity === level ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-700'}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <label className="text-sm text-slate-600">
                    <span className="control-label">Green phase</span>
                    <input type="number" value={green} onChange={(event) => setGreen(Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" />
                  </label>
                  <label className="text-sm text-slate-600">
                    <span className="control-label">Amber phase</span>
                    <input type="number" value={amber} onChange={(event) => setAmber(Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" />
                  </label>
                  <label className="text-sm text-slate-600">
                    <span className="control-label">Red phase</span>
                    <input type="number" value={red} onChange={(event) => setRed(Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" />
                  </label>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">AI recommendation approval</p>
                  <p className="mt-2 leading-6">Selected incident: {activeIncident.title}</p>
                  <p className="mt-2 leading-6">Suggested plan: {selectedPlan ? `${selectedPlan.green}s green / ${selectedPlan.amber}s amber / ${selectedPlan.red}s red` : `${green}s green / ${amber}s amber / ${red}s red`}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button type="button" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">Approve intervention</button>
                  <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Reject intervention</button>
                  <button type="button" className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100">Broadcast alert</button>
                </div>
              </div>
            </Panel>
          ) : null}
        </div>
      </section>
    </div>
  );
}
