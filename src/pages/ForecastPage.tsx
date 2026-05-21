import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TrafficMap } from '../components/map/TrafficMap';
import { MetricCard } from '../components/ui/MetricCard';
import { Panel } from '../components/ui/Panel';
import { mockApi } from '../data/mockApi';
import { useTrafficStore } from '../store/useTrafficStore';

export function ForecastPage() {
  const [forecast, setForecast] = useState<Awaited<ReturnType<typeof mockApi.getForecast>> | null>(null);
  const forecastHorizon = useTrafficStore((state) => state.forecastHorizon);
  const setForecastHorizon = useTrafficStore((state) => state.setForecastHorizon);
  const timelineStep = useTrafficStore((state) => state.timelineStep);
  const setTimelineStep = useTrafficStore((state) => state.setTimelineStep);

  useEffect(() => {
    mockApi.getForecast().then(setForecast);
  }, []);

  const visibleForecast = forecast?.forecastSeries.slice(0, forecastHorizon) ?? [];

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Forecast horizon', value: `${forecastHorizon} steps`, detail: 'Simulation window' },
          { label: 'Playback step', value: `${timelineStep}`, detail: 'Simulation frame index', tone: 'success' as const },
          { label: 'Predicted peak risk', value: '82%', detail: 'Event-aware spike window', tone: 'warning' as const },
          { label: 'Expected travel gain', value: '18%', detail: 'If diversions are applied', tone: 'default' as const },
        ].map((item) => (
          <MetricCard key={item.label} {...item} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Panel title="Predictive traffic forecasting" eyebrow="Future simulation">
          <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <TrafficMap className="h-[520px]" />
            </div>
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <div className="control-label">Prediction horizon</div>
                <input
                  type="range"
                  min={3}
                  max={8}
                  value={forecastHorizon}
                  onChange={(event) => setForecastHorizon(Number(event.target.value))}
                  className="mt-3 w-full accent-slate-950"
                />
              </div>
              <div>
                <div className="control-label">Playback position</div>
                <input
                  type="range"
                  min={0}
                  max={7}
                  value={timelineStep}
                  onChange={(event) => setTimelineStep(Number(event.target.value))}
                  className="mt-3 w-full accent-slate-950"
                />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
                The forecast combines live congestion state, event pressure, and corridor spillback to simulate future queue growth.
              </div>
            </div>
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel title="Forecast trends" eyebrow="Rolling horizon">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visibleForecast}>
                  <defs>
                    <linearGradient id="forecastCongestion" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="timestamp" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 'dataMax + 1']} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="congestionIndex" name="Congestion" stroke="#2563eb" fill="url(#forecastCongestion)" />
                  <Line type="monotone" dataKey="risk" name="Risk" stroke="#ef4444" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Future queue build-up" eyebrow="Operational projection">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visibleForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="timestamp" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="queueLength" stroke="#0f766e" strokeWidth={3} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="travelTimeMinutes" stroke="#b91c1c" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
}
