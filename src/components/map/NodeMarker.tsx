import { Popup, CircleMarker } from 'react-leaflet';
import type { JunctionNode } from '../../types/traffic';

const BLUE = '#3b82f6';

export function NodeMarker({
  node,
  onSelect,
  onHover,
}: {
  node: JunctionNode;
  onSelect: (id: string) => void;
  onHover: (payload: { title: string; body: string; x: number; y: number } | null) => void;
}) {
  const hoverBody = `${node.zone} · ${node.type} · ${node.signalClass === 'bottleneck' ? 'Hotspot' : node.signalClass === 'transit' ? 'Transit hub' : node.signalClass === 'event-aware' ? 'Event-sensitive' : 'Signalized'} · Queue ${node.queueLength} m · Speed ${Math.round(node.speed)} km/h · Delay ${Math.round(node.delay)} s`;

  return (
    <CircleMarker
      center={[node.lat, node.lng]}
      radius={8}
      pathOptions={{
        color: BLUE,
        fillColor: BLUE,
        fillOpacity: 0.9,
        weight: 2,
      }}
      eventHandlers={{
        click: () => onSelect(node.id),
        mouseover: (event) => {
          const point = event.target._map.latLngToContainerPoint(event.latlng);
          onHover({
            title: node.name,
            body: `${hoverBody} · Risk ${Math.round(node.predictedRisk * 100)}%`,
            x: point.x,
            y: point.y,
          });
        },
        mousemove: (event) => {
          const point = event.target._map.latLngToContainerPoint(event.latlng);
          onHover({
            title: node.name,
            body: `${hoverBody} · Risk ${Math.round(node.predictedRisk * 100)}%`,
            x: point.x,
            y: point.y,
          });
        },
        mouseout: () => onHover(null),
      }}
    >
      <Popup>
        <div className="text-[12px] leading-5 text-[var(--text)]">
          <div className="font-medium">📍 {node.name}</div>
          <div className="text-[var(--muted)]">{node.zone}</div>
          <div className="text-[var(--muted)]">{hoverBody}</div>
        </div>
      </Popup>
    </CircleMarker>
  );
}
