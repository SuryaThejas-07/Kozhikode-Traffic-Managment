import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { KUTISMap } from '../map/KUTISMap';
import { TopNav } from './TopNav';
import { useTrafficStore } from '../../store/traffic.store';

export function KUTISShell() {
  const location = useLocation();
  const tickNow = useTrafficStore((state) => state.tickNow);
  const hiddenMap = useTrafficStore((state) => state.hiddenMap);
  const setHiddenMap = useTrafficStore((state) => state.setHiddenMap);

  useEffect(() => {
    const interval = window.setInterval(() => tickNow(), 1000);
    return () => window.clearInterval(interval);
  }, [tickNow]);

  useEffect(() => {
    setHiddenMap(['/analytics', '/system-admin'].includes(location.pathname));
  }, [location.pathname, setHiddenMap]);

  return (
    <div className="flex h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
      <TopNav />
      <div className="relative flex-1 overflow-hidden">
        <KUTISMap hidden={hiddenMap} />
        <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
          <Outlet />
        </div>
      </div>
      <footer className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[11px] text-[var(--muted)]">
        KUTIS v1.0 · Kozhikode Smart City Mission · ST-GNN Traffic Intelligence
      </footer>
    </div>
  );
}
