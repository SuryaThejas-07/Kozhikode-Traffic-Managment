import { useEffect } from 'react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Panel } from '../components/ui/Panel';
import { MetricCard } from '../components/ui/MetricCard';
import { useForecastStore } from '../store/forecast.store';
import { useTrafficStore } from '../store/traffic.store';
import { getForecastSeries } from '../data/mock';

export function Forecasting() {
  const points = useForecastStore((state) => state.points);
  const recompute = useForecastStore((state) => state.recompute);
  const horizon = useForecastStore((state) => state.horizon);
  const setHorizon = useForecastStore((state) => state.setHorizon);
  const eventEnabled = useTrafficStore((state) => state.eventEnabled);
  const forecastCrowd = useTrafficStore((state) => state.forecastCrowd);
  const setForecastCrowd = useTrafficStore((state) => state.setForecastCrowd);
  const setEventEnabled = useTrafficStore((state) => state.setEventEnabled);

  useEffect(() => {
    recompute(eventEnabled, forecastCrowd);
  }, [eventEnabled, forecastCrowd, recompute]);

  const corridorRows = ['Mavoor Road', 'Mini Bypass Road', 'Bank Road', 'SM Street Road', 'M.M Ali Road', 'Palayam Road'];
  const forecastForBand = getForecastSeries(eventEnabled, forecastCrowd);

  return (
    <div className="absolute inset-0 flex">
      <div className="w-[55%] min-w-0" />
      <div className="pointer-events-none w-[45%] p-3">
        <Panel title="Predictive Traffic Forecasting" subtitle="Future simulation" className="pointer-events-auto h-[calc(100vh-96px)] overflow-y-auto">
          <div className="flex flex-wrap gap-2 text-[12px]">
            {[5, 10, 15, 20, 25].map((value) => (
              <button key={value} type="button" onClick={() => setHorizon(value as 5 | 10 | 15 | 20 | 25)} className={`min-w-0 flex-1 rounded-[6px] border px-3 py-2 ${horizon === value ? 'border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_12%,transparent)]' : 'border-[var(--border)]'}`}>
                +{value}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            <label className="flex items-center justify-between text-[12px]">
              <span>Simulate event at Stadium Junction</span>
              <input type="checkbox" checked={eventEnabled} onChange={(event) => setEventEnabled(event.target.checked)} />
            </label>
            <label className="block text-[12px]">
              Crowd {forecastCrowd.toLocaleString('en-IN')}
              <input type="range" min={5000} max={50000} step={1000} value={forecastCrowd} onChange={(event) => setForecastCrowd(Number(event.target.value))} className="mt-2 w-full" />
            </label>
          </div>

          <div className="mt-4 overflow-x-auto">
            <div className="min-w-[560px] grid gap-2">
            {corridorRows.map((row) => (
              <div key={row} className="flex items-center gap-2 text-[11px]">
                <div className="w-[100px] truncate text-[var(--muted)]">{row}</div>
                {[0, 1, 2, 3, 4].map((step) => (
                  <div key={step} className="h-7 w-7 rounded-[6px] border border-[var(--border)]" style={{ background: `color-mix(in srgb, var(--accent) ${(forecastForBand[step].speed / 60) * 100}%, transparent)` }} />
                ))}
              </div>
            ))}
            </div>
          </div>

          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={points.map((point) => ({ label: `+${point.horizon}m`, predicted: point.speed, upper: point.ci_upper, lower: point.ci_lower }))}>
                <CartesianGrid stroke="var(--border)" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="upper" fill="color-mix(in srgb, var(--accent) 15%, transparent)" stroke="transparent" />
                <Area type="monotone" dataKey="lower" fill="transparent" stroke="transparent" />
                <Line type="monotone" dataKey="predicted" stroke="var(--accent)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </div>
  );
}
