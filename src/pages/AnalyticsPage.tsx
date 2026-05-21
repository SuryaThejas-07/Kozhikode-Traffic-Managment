import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, Radar, RadarChart, ResponsiveContainer, Tooltip, PolarGrid, PolarAngleAxis, BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { MetricCard } from '../components/ui/MetricCard';
import { Panel } from '../components/ui/Panel';
import { demandCurve, junctions } from '../data/trafficNetwork';
import { mockApi } from '../data/mockApi';

export function AnalyticsPage() {
  const [metrics, setMetrics] = useState<Awaited<ReturnType<typeof mockApi.getSystemMetrics>>>([]);

  useEffect(() => {
    mockApi.getSystemMetrics().then(setMetrics);
  }, []);

  const congestionData = demandCurve.map((item) => ({
    hour: `${item.hour}:00`,
    congestionIndex: item.congestionIndex,
    queueLength: item.queueLength,
    travelTimeMinutes: item.travelTimeMinutes,
  }));

  const junctionComparison = junctions.map((junction) => ({
    name: junction.id,
    congestionIndex: junction.congestionIndex,
    queueLength: junction.queueLength,
    speed: junction.speed,
    risk: junction.predictedRisk,
  }));

  const signalPie = junctions.map((junction) => ({
    name: junction.name.split('(')[0].trim(),
    value: junction.signalTimings.green,
  }));

  const modelRadar = [
    { metric: 'Accuracy', value: 92 },
    { metric: 'Latency', value: 87 },
    { metric: 'Recall', value: 90 },
    { metric: 'Stability', value: 94 },
    { metric: 'Explainability', value: 83 },
  ];

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Congestion trend', value: 'Rising', detail: 'Late afternoon corridor pressure', tone: 'warning' as const },
          { label: 'Peak window', value: '17:30-19:00', detail: 'Commercial and event overlap' },
          { label: 'Model F1 score', value: '0.91', detail: 'Validated on Kozhikode corridor data', tone: 'success' as const },
          { label: 'Route efficiency', value: '78%', detail: 'Median corridor performance' },
        ].map((item) => (
          <MetricCard key={item.label} {...item} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <Panel title="Congestion and queue trends" eyebrow="Hourly traffic patterns">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={congestionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="queueLength" name="Queue" fill="#0f766e" radius={[10, 10, 0, 0]} />
                <Bar dataKey="travelTimeMinutes" name="Travel time" fill="#2563eb" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Junction comparison" eyebrow="Executive benchmark">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={junctionComparison} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={90} tick={{ fill: '#334155', fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="congestionIndex" name="Congestion" fill="#ef4444" radius={[0, 10, 10, 0]} />
                <Bar dataKey="speed" name="Speed" fill="#16a34a" radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Panel title="Signal efficiency mix" eyebrow="Timing analysis">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={signalPie} dataKey="value" innerRadius={72} outerRadius={112} paddingAngle={3}>
                  {signalPie.map((entry, index) => (
                    <Cell key={entry.name} fill={["#2563eb", "#0f766e", "#f97316", "#ef4444", "#7c3aed", "#14b8a6", "#b45309", "#0f172a"][index % 8]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="AI model performance" eyebrow="Scoring radar">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={modelRadar}>
                <PolarGrid stroke="#cbd5e1" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#475569', fontSize: 12 }} />
                <Radar dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {metrics.map((metric) => (
          <Panel key={metric.label} title={metric.label} eyebrow="System metric">
            <div className="text-3xl font-semibold text-slate-950">{metric.value}</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{metric.detail}</p>
          </Panel>
        ))}
      </section>
    </div>
  );
}
