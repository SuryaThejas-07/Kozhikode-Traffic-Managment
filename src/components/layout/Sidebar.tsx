import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn';

const items = [
  { to: '/', label: 'Live Command Center', short: 'Command' },
  { to: '/ai-engine', label: 'AI Traffic Engine', short: 'AI' },
  { to: '/forecast', label: 'Predictive Forecasting', short: 'Forecast' },
  { to: '/analytics', label: 'Analytics & Insights', short: 'Insights' },
  { to: '/incident-response', label: 'Incident Response', short: 'Response' },
  { to: '/event-management', label: 'Event Traffic Management', short: 'Events' },
  { to: '/monitoring', label: 'System Monitoring', short: 'Health' },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-slate-950 px-4 py-5 text-slate-100 lg:w-[288px]">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl shadow-slate-950/20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Kozhikode District</p>
        <h1 className="mt-2 text-xl font-semibold text-white">Mobility Command Center</h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Smart city traffic intelligence for live operations, forecasting, event control, and emergency coordination.
        </p>
      </div>

      <nav className="mt-6 space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition-colors',
                isActive
                  ? 'border-blue-400/40 bg-blue-500/15 text-white shadow-lg shadow-blue-950/10'
                  : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700 hover:bg-slate-900 hover:text-white',
              )
            }
          >
            <span>{item.label}</span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-slate-400">{item.short}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">Operational note</p>
        <p className="mt-2 leading-6">
          Roads and junctions are aligned to the Kozhikode corridor graph centered on Mavoor Road, Bus Stand,
          Stadium, Mananchira, Poonthanam, Arayidathupalam, and Palayam.
        </p>
      </div>
    </aside>
  );
}
