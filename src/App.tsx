import { Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { KUTISShell } from './components/layout/KUTISShell';
import { CommandCenter } from './pages/CommandCenter';
import { AIEngine } from './pages/AIEngine';
import { Forecasting } from './pages/Forecasting';
import { Analytics } from './pages/Analytics';
import { Incidents } from './pages/Incidents';
import { Events } from './pages/Events';
import { SystemAdmin } from './pages/SystemAdmin';

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<KUTISShell />}>
          <Route path="/" element={<Navigate to="/command-center" replace />} />
          <Route path="/command-center" element={<CommandCenter />} />
          <Route path="/ai-engine" element={<AIEngine />} />
          <Route path="/forecasting" element={<Forecasting />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/events" element={<Events />} />
          <Route path="/system-admin" element={<SystemAdmin />} />
          <Route path="*" element={<Navigate to="/command-center" replace />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
