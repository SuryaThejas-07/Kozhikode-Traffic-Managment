import { useMemo } from 'react';
import { Circle, CircleMarker, MapContainer, Marker, Polyline, Popup, Tooltip, TileLayer } from 'react-leaflet';
import { junctions as baseJunctions, roads as baseRoads } from '../../data/trafficNetwork';
import { buildLinkPath } from '../../lib/traffic';
import { simulateJunctionFrame, simulateRoadFrame, roadPressure } from '../../lib/simulation';
import { cn } from '../../lib/cn';
import { useTrafficStore } from '../../store/useTrafficStore';
import type { JunctionNode, RoadLink } from '../../types/traffic';
import { createNodeIcon } from './nodeIcon';

interface TrafficMapProps {
  className?: string;
  roads?: RoadLink[];
  junctions?: JunctionNode[];
  height?: string;
  interactive?: boolean;
}

const CENTER: [number, number] = [11.2588, 75.7804];
const BOUNDS: [[number, number], [number, number]] = [
  [11.246, 75.776],
  [11.2635, 75.7938],
];

const roadWidthByClass: Record<RoadLink['roadClass'], number> = {
  arterial: 10,
  collector: 8,
  connector: 7,
  bypass: 10,
  transit: 10,
};

const roadBaseColorByClass: Record<RoadLink['roadClass'], string> = {
  arterial: '#ff7b00',
  collector: '#ffaa33',
  connector: '#ffaa33',
  bypass: '#ff7b00',
  transit: '#ff7b00',
};

const nodeTone: Record<JunctionNode['signalClass'], string> = {
  signalized: '#2f7df6',
  connector: '#5b8def',
  bottleneck: '#ff3b30',
  transit: '#4f46e5',
  'event-aware': '#f59e0b',
};

const pointAt = (points: Array<[number, number]>, fraction: number): [number, number] => {
  if (points.length === 0) return [0, 0];
  if (points.length === 1) return points[0];

  const segments = points.slice(1).map((point, index) => {
    const start = points[index];
    const dy = point[0] - start[0];
    const dx = point[1] - start[1];
    return Math.sqrt(dy * dy + dx * dx);
  });
  const total = segments.reduce((sum, value) => sum + value, 0);
  const target = total * (fraction % 1);

  let walked = 0;
  for (let index = 0; index < segments.length; index += 1) {
    const segmentLength = segments[index];
    const next = walked + segmentLength;
    if (target <= next || index === segments.length - 1) {
      const ratio = segmentLength === 0 ? 0 : (target - walked) / segmentLength;
      const start = points[index];
      const end = points[index + 1];
      return [start[0] + (end[0] - start[0]) * ratio, start[1] + (end[1] - start[1]) * ratio];
    }
    walked = next;
  }

  return points[points.length - 1];
};

export function TrafficMap({ className, roads = baseRoads, junctions = baseJunctions, height = '100%', interactive = true }: TrafficMapProps) {
  const tick = useTrafficStore((state) => state.clockTick);
  const selectedJunctionId = useTrafficStore((state) => state.selectedJunctionId);
  const setSelectedJunctionId = useTrafficStore((state) => state.setSelectedJunctionId);
  const searchQuery = useTrafficStore((state) => state.searchQuery);
  const activeEventId = useTrafficStore((state) => state.selectedEventId);

  const searchTerm = searchQuery.trim().toLowerCase();
  const filteredJunctions = searchTerm
    ? junctions.filter((junction) => `${junction.name} ${junction.zone}`.toLowerCase().includes(searchTerm))
    : junctions;

  const filteredRoads = useMemo(() => {
    if (!searchTerm) return roads;
    const junctionIds = new Set(filteredJunctions.map((junction) => junction.id));
    return roads.filter((road) => junctionIds.has(road.from) && junctionIds.has(road.to));
  }, [filteredJunctions, roads, searchTerm]);

  const roadFrames = useMemo(
    () =>
      filteredRoads.map((road) => ({
        road,
        frame: simulateRoadFrame(road, tick, roadPressure(road, activeEventId)),
      })),
    [activeEventId, filteredRoads, tick],
  );

  const junctionFrames = useMemo(
    () =>
      filteredJunctions.map((junction) => ({
        junction,
        frame: simulateJunctionFrame(junction, tick),
      })),
    [filteredJunctions, tick],
  );

  const activeJunction = junctionFrames.find((item) => item.junction.id === selectedJunctionId) ?? junctionFrames[0];

  return (
    <div className={cn('relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-panel', className)} style={{ height }}>
      <MapContainer
        center={CENTER}
        zoom={14}
        minZoom={13}
        maxBounds={BOUNDS}
        maxBoundsViscosity={1}
        scrollWheelZoom
        doubleClickZoom
        dragging
        touchZoom
        zoomControl={false}
        attributionControl
        className="h-full w-full"
        preferCanvas
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {roadFrames.map(({ road, frame }) => {
          const from = junctions.find((junction) => junction.id === road.from);
          const to = junctions.find((junction) => junction.id === road.to);

          if (!from || !to) return null;

          const path = buildLinkPath(road, Object.fromEntries(junctions.map((n) => [n.id, n])));
          const severityColor = frame.congestionIndex >= 0.72 ? '#ff3b30' : frame.congestionIndex >= 0.52 ? '#ffaa33' : '#34c759';
          const baseColor = roadBaseColorByClass[road.roadClass];
          const isHighlighted = frame.congestionIndex >= 0.58 || selectedJunctionId === road.from || selectedJunctionId === road.to;

          return (
            <Polyline
              key={road.id}
              positions={path}
              pathOptions={{
                color: frame.congestionIndex >= 0.72 ? severityColor : baseColor,
                weight: roadWidthByClass[road.roadClass],
                opacity: isHighlighted ? 0.96 : 0.8,
                lineCap: 'round',
                lineJoin: 'round',
                dashArray: road.eventSensitive && activeEventId === 'event-ems-match' ? '8 10' : undefined,
              }}
              eventHandlers={interactive ? { click: () => setSelectedJunctionId(road.to) } : undefined}
            >
              <Tooltip direction="top" sticky>
                <div className="space-y-1 text-sm leading-5">
                  <div className="text-base font-semibold text-slate-950">{road.name}</div>
                  <div>{road.corridor}</div>
                  <div>Congestion {Math.round(frame.congestionIndex * 100)}%</div>
                  <div>Speed {frame.speed} km/h</div>
                  <div>Queue {frame.queueLength} m</div>
                </div>
              </Tooltip>
            </Polyline>
          );
        })}

        {roadFrames.map(({ road, frame }) => {
          const from = junctions.find((junction) => junction.id === road.from);
          const to = junctions.find((junction) => junction.id === road.to);
          if (!from || !to) return null;
          const path = buildLinkPath(road, Object.fromEntries(junctions.map((n) => [n.id, n])));
          const vehicle = pointAt(path, tick / 10 + frame.congestionIndex * 0.5);
          return (
            <CircleMarker
              key={`${road.id}-vehicle`}
              center={vehicle}
              radius={4}
              pathOptions={{ color: '#fff', weight: 1, fillColor: frame.congestionIndex >= 0.72 ? '#ff3b30' : '#ff7b00', fillOpacity: 1 }}
            />
          );
        })}

        {junctionFrames.map(({ junction, frame }) => {
          const isActive = activeJunction?.junction.id === junction.id;
          const tone = nodeTone[junction.signalClass];
          const pulse = 78 + Math.sin((tick + frame.density * 10) / 3) * 8;
          const congestionPct = Math.round(frame.congestionIndex * 100);

          return (
            <>
              <Circle
                key={`${junction.id}-pulse`}
                center={[junction.lat, junction.lng]}
                radius={pulse}
                pathOptions={{ color: tone, fillColor: tone, fillOpacity: 0.08, weight: 0 }}
              />
              <Marker
                key={junction.id}
                position={[junction.lat, junction.lng]}
                icon={createNodeIcon(junction.signalClass)}
                eventHandlers={interactive ? { click: () => setSelectedJunctionId(junction.id) } : undefined}
              >
                <Tooltip direction="top" sticky>
                  <div className="space-y-1 text-sm leading-5">
                    <div className="text-base font-semibold text-slate-950">{junction.name}</div>
                    <div>{congestionPct}% traffic</div>
                    <div>Queue {frame.queueLength} m</div>
                    <div>Signal {junction.currentPhase}</div>
                  </div>
                </Tooltip>
                <Popup>
                  <div className="space-y-2 text-sm text-slate-700">
                    <p className="text-base font-semibold text-slate-950">📍 {junction.name}</p>
                    <p>Live traffic: {congestionPct}%</p>
                    <p>Signal phase: {junction.currentPhase}</p>
                    <p>Queue length: {frame.queueLength} m</p>
                    <p>Speed: {frame.speed} km/h</p>
                  </div>
                </Popup>
              </Marker>
            </>
          );
        })}
      </MapContainer>

      <div className="pointer-events-none absolute left-4 top-4 rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-xs text-slate-200 shadow-soft backdrop-blur-sm">
        <div className="font-semibold text-white">Kozhikode traffic network</div>
        <div>{filteredJunctions.length} junctions · {filteredRoads.length} road links</div>
      </div>

      <div className="pointer-events-none absolute right-4 top-4 rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-xs text-slate-200 shadow-soft backdrop-blur-sm">
        <div className="space-y-1">
          <div><span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" /> Smooth</div>
          <div><span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400" /> Moderate</div>
          <div><span className="inline-block h-2.5 w-2.5 rounded-full bg-orange-500" /> Heavy</div>
          <div><span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" /> Severe</div>
        </div>
      </div>
    </div>
  );
}
