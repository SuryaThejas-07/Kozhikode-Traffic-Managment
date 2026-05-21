import { Area, AreaChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Panel } from '../components/ui/Panel';
import { MetricCard } from '../components/ui/MetricCard';

const latency = Array.from({ length: 60 }, (_, index) => ({ time: index, ms: 110 + Math.sin(index / 5) * 25 + (index > 40 ? 35 : 0) }));

export function SystemAdmin() {
  return (
    <div className="absolute inset-0 overflow-y-auto bg-[var(--bg)] p-3">
      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="ST-GNN v2.1" value="Active" detail="Accuracy 94.2% · Latency 120ms · Last trained 3h ago" />
        <MetricCard label="Data pipeline" value="Healthy" detail="847 records/min · 12/12 junctions feeding · Uptime 99.7%" />
        <MetricCard label="Cloud sync" value="Connected" detail="Google Cloud · Last sync 28s ago" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Panel title="Live latency" subtitle="5-second update cycle">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latency}>
                <CartesianGrid stroke="var(--border)" />
                <XAxis dataKey="time" hide />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ms" stroke="var(--accent)" dot={(props) => (props.payload.ms > 200 ? <circle cx={props.cx} cy={props.cy} r={3} fill="var(--danger)" /> : <circle cx={props.cx} cy={props.cy} r={2} fill="var(--accent)" />)} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Sensor health" subtitle="Per junction status">
          <div className="grid grid-cols-4 gap-2 text-[11px]">
            {['Loop Detector', 'CCTV', 'Bluetooth', 'Weather'].map((item) => (
              <div key={item} className="rounded-[6px] border border-[var(--border)] p-3">{item}</div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Panel title="LOS distribution" subtitle="Service levels">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{ name: 'A', value: 12 }, { name: 'B', value: 16 }, { name: 'C', value: 20 }, { name: 'D', value: 18 }, { name: 'E', value: 19 }, { name: 'F', value: 15 }]} dataKey="value" innerRadius={70} outerRadius={100}>
                  {['#22C55E', '#84CC16', '#F59E0B', '#F97316', '#EF4444', '#7F1D1D'].map((color) => <Cell key={color} fill={color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Pipeline" subtitle="Control chain">
          <div className="text-[12px] leading-6 text-[var(--muted)]">CCTV → AI Inference → Feature Extract → ST-GNN → Predictions → Dashboard</div>
        </Panel>
      </div>
    </div>
  );
}
