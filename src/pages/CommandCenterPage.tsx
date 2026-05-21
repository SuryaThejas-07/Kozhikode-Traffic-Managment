import { useEffect, useState } from 'react';
import { TrafficMap } from '../components/map/TrafficMap';
import { MetricCard } from '../components/ui/MetricCard';
import { Panel } from '../components/ui/Panel';
import { SkeletonCard } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { getJunctionById, getRoadsForJunction, liveSnapshot } from '../data/trafficNetwork';
import { mockApi } from '../data/mockApi';
import { useTrafficStore } from '../store/useTrafficStore';
import { formatPercent } from '../lib/format';
import { congestionLabel } from '../lib/trafficMath';

export function CommandCenterPage() {
  const [loading, setLoading] = useState(true);
  const [incidentCount, setIncidentCount] = useState(liveSnapshot.incidentsOpen);
  const [systemMetrics, setSystemMetrics] = useState<typeof import('../data/trafficNetwork').systemMetrics>([]);
  const [lastSyncAt, setLastSyncAt] = useState<string>(liveSnapshot.timestamp);
  const searchQuery = useTrafficStore((state) => state.searchQuery);
  const setSearchQuery = useTrafficStore((state) => state.setSearchQuery);
  const activeLayers = useTrafficStore((state) => state.activeLayers);
  const toggleLayer = useTrafficStore((state) => state.toggleLayer);
  const selectedJunctionId = useTrafficStore((state) => state.selectedJunctionId);

  useEffect(() => {
    let mounted = true;

    const loadLiveData = async () => {
      const [, incidentsResult, metrics] = await Promise.all([mockApi.getLiveTraffic(), mockApi.getIncidents(), mockApi.getSystemMetrics()]);

      if (!mounted) {
        return;
      }

      setIncidentCount(incidentsResult.length);
      setSystemMetrics(metrics);
      setLastSyncAt(new Date().toISOString());
      setLoading(false);
    };

    void loadLiveData();

    const interval = window.setInterval(() => {
      void loadLiveData();
    }, 5000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const selectedJunction = getJunctionById(selectedJunctionId);
  const junctionRoads = selectedJunction ? getRoadsForJunction(selectedJunction.id) : [];

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }, (_, index) => <SkeletonCard key={index} />)
          : [
              {
                label: 'Overall congestion',
                value: formatPercent(liveSnapshot.overallCongestion * 100),
                detail: congestionLabel(liveSnapshot.overallCongestion),
                tone: 'warning' as const,
                trend: 'Live',
              },
              {
                label: 'Open incidents',
                value: `${incidentCount}`,
                detail: 'Active alerts and escalations in progress',
                tone: incidentCount > 2 ? ('danger' as const) : ('default' as const),
                trend: 'Ops',
              },
              {
                label: 'Active signals',
                value: `${liveSnapshot.activeSignals}`,
                detail: 'Signal controllers reporting healthy sync',
                tone: 'success' as const,
                trend: 'Signals',
              },
              {
                label: 'Emergency lanes',
                value: `${liveSnapshot.emergencyLanes}`,
                detail: 'Reserved for incident routing and response',
                tone: 'default' as const,
                trend: 'Priority',
              },
            ].map((item) => <MetricCard key={item.label} {...item} />)}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Live sync active. Last refreshed at {new Date(lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}.
      </section>

      <section className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
        <Panel title="Live controls" eyebrow="Command interface">
          <div className="space-y-5">
            <div>
              <label className="control-label" htmlFor="search-junction">Search junction</label>
              <input
                id="search-junction"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Mavoor Road, Bus Stand, Stadium"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <div className="control-label">Layer control</div>
              <div className="mt-3 space-y-2">
                {Object.entries(activeLayers).map(([key, enabled]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleLayer(key as keyof typeof activeLayers)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${enabled ? 'border-blue-200 bg-blue-50 text-blue-800' : 'border-slate-200 bg-white text-slate-600'}`}
                  >
                    <span className="capitalize">{key}</span>
                    <span className={`h-2.5 w-2.5 rounded-full ${enabled ? 'bg-blue-500' : 'bg-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="control-label">Weather summary</div>
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                {liveSnapshot.weather}. Visibility {liveSnapshot.visibility}, temperature {liveSnapshot.temperatureC}°C, humidity {liveSnapshot.humidity}%.
              </div>
            </div>

            <div>
              <div className="control-label">Traffic legend</div>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                {[
                  ['green', 'Smooth'],
                  ['yellow', 'Moderate'],
                  ['orange', 'Heavy'],
                  ['red', 'Severe'],
                  ['maroon', 'Critical'],
                ].map(([tone, label]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-2">
                    <span className="flex items-center gap-3">
                      <span className={`h-3 w-3 rounded-full ${tone === 'green' ? 'bg-emerald-500' : tone === 'yellow' ? 'bg-amber-400' : tone === 'orange' ? 'bg-orange-500' : tone === 'red' ? 'bg-red-500' : 'bg-red-950'}`} />
                      {label}
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{tone}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel title="Live traffic command center" eyebrow="OpenStreetMap network" className="overflow-hidden p-0">
            <TrafficMap className="h-[740px] rounded-none border-0 shadow-none" />
          </Panel>
          {loading ? null : selectedJunction ? (
            <Panel title={selectedJunction.name} eyebrow="Selected junction status">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Queue length" value={`${selectedJunction.queueLength} m`} detail={selectedJunction.headline} />
                <MetricCard label="Speed" value={`${selectedJunction.speed} km/h`} detail={selectedJunction.currentPhase} tone="success" />
                <MetricCard label="Delay" value={`${selectedJunction.delay} min`} detail={`AI confidence ${Math.round(selectedJunction.aiConfidence * 100)}%`} tone="warning" />
                <MetricCard label="Roads linked" value={`${junctionRoads.length}`} detail="Connected corridor segments" />
              </div>
            </Panel>
          ) : null}
        </div>

        <Panel title="Right rail analytics" eyebrow="Operational context">
          <div className="space-y-4">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : systemMetrics.length > 0 ? (
              systemMetrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{metric.label}</div>
                      <div className="mt-2 text-xl font-semibold text-slate-950">{metric.value}</div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${metric.status === 'good' ? 'bg-emerald-50 text-emerald-700' : metric.status === 'warning' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                      {metric.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{metric.detail}</p>
                </div>
              ))
            ) : (
              <EmptyState title="No health metrics" description="Telemetry is unavailable. The dashboard will retain the last known operational view until sync resumes." />
            )}
          </div>
        </Panel>
      </section>
    </div>
  );
}
