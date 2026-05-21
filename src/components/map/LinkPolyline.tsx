import { useMemo } from 'react';
import { Polyline } from 'react-leaflet';
import { buildLinkPath } from '../../lib/traffic';
import { junctions } from '../../data/trafficNetwork';
import type { LinkState, RoadLink } from '../../types/traffic';

const nodeMap = Object.fromEntries(junctions.map((node) => [node.id, node]));

export function LinkPolyline({ link, state, onHover, onSelect }: { link: RoadLink; state: LinkState; onHover: (payload: { title: string; body: string; x: number; y: number } | null) => void; onSelect: (id: string) => void }) {
  const path = useMemo(() => buildLinkPath(link, nodeMap), [link]);
  const hoverBody = `Flow ${Math.round(state.speed)} km/h · Queue ${Math.round(state.queue)} m · Traffic ${state.los} · Load ${Math.round(state.volume)} veh/hr · Predicted ${Math.round(state.predicted_speed_15m)} km/h`;

  return (
    <Polyline
      positions={path}
      pathOptions={{
        color: '#f97316',
        weight: 7,
        opacity: 0.92,
        lineCap: 'round',
        lineJoin: 'round',
      }}
      eventHandlers={{
        click: () => onSelect(link.id),
        mouseover: (event) => {
          const point = event.target._map.latLngToContainerPoint(event.latlng);
          onHover({ title: link.name, body: `${link.corridor} · ${hoverBody}`, x: point.x, y: point.y });
        },
        mousemove: (event) => {
          const point = event.target._map.latLngToContainerPoint(event.latlng);
          onHover({ title: link.name, body: `${link.corridor} · ${hoverBody}`, x: point.x, y: point.y });
        },
        mouseout: () => onHover(null),
      }}
    />
  );
}
