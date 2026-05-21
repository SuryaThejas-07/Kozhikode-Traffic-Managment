import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { junctions as baseJunctions, roads as baseRoads } from '../../data/trafficNetwork';
import { useThemeStore } from '../../store/theme.store';
import { useTrafficStore } from '../../store/traffic.store';
import { LinkPolyline } from './LinkPolyline';
import { LayerControl } from './LayerControl';
import { NodeMarker } from './NodeMarker';
import { LinkTooltip } from './LinkTooltip';
import { Badge } from '../ui/Badge';

const CENTER: [number, number] = [11.2545, 75.7848];
const BOUNDS: [[number, number], [number, number]] = [
  [11.2468, 75.7774],
  [11.2626, 75.7932],
];
const TILE_URLS = {
  light: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  dark: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  satellite: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
} as const;

function MapEffects({ tileRef }: { tileRef: React.RefObject<L.TileLayer | null> }) {
  const theme = useThemeStore((state) => state.theme);
  const hiddenMap = useTrafficStore((state) => state.hiddenMap);
  const map = useMap();

  useEffect(() => {
    const url = TILE_URLS[theme];
    tileRef.current?.setUrl(url);
  }, [theme, tileRef]);

  useEffect(() => {
    if (hiddenMap) {
      map.getContainer().style.display = 'none';
    } else {
      map.getContainer().style.display = 'block';
    }
  }, [hiddenMap, map]);

  useEffect(() => {
    map.fitBounds(BOUNDS, { animate: false, padding: [16, 16] });
  }, [map]);

  useEffect(() => {
    map.scrollWheelZoom.enable();
    map.dragging.enable();
    map.doubleClickZoom.enable();
    map.touchZoom.enable();
  }, [map]);

  return null;
}

export function KUTISMap({ hidden = false }: { hidden?: boolean }) {
  const tileRef = useRef<L.TileLayer | null>(null);
  const theme = useThemeStore((state) => state.theme);
  const layers = useTrafficStore((state) => state.layers);
  const setSelectedNodeId = useTrafficStore((state) => state.setSelectedNodeId);
  const setSelectedLinkId = useTrafficStore((state) => state.setSelectedLinkId);
  const linkStates = useTrafficStore((state) => state.linkStates);

  const [hover, setHover] = useState<{ title: string; body: string; x: number; y: number } | null>(null);
  const mapClasses = hidden ? 'hidden' : 'block';

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${mapClasses}`}>
      <MapContainer center={CENTER} zoom={14} zoomControl={false} scrollWheelZoom dragging doubleClickZoom touchZoom className="h-full w-full" preferCanvas maxBounds={BOUNDS} maxBoundsViscosity={1}>
        <TileLayer ref={tileRef} url={TILE_URLS[theme]} />
        <MapEffects tileRef={tileRef} />

        <LayerControl />

        {layers.traffic &&
          baseRoads.map((link) => {
            const state = linkStates[link.id];
            return <LinkPolyline key={link.id} link={link} state={state} onHover={setHover} onSelect={setSelectedLinkId} />;
          })}

        {layers.nodes &&
          baseJunctions.map((node) => {
            return <NodeMarker key={node.id} node={node} onSelect={setSelectedNodeId} onHover={setHover} />;
          })}
      </MapContainer>

      {!hidden && (
        <>
          <div className="absolute top-3 left-1/2 z-20 -translate-x-1/2">
            <Badge tone="accent">Network: {Math.round(Object.values(linkStates).reduce((sum, link) => sum + link.speed, 0) / Object.values(linkStates).length)} · Fair</Badge>
          </div>
          {hover ? <LinkTooltip title={hover.title} body={hover.body} x={hover.x} y={hover.y} /> : null}
        </>
      )}
    </div>
  );
}
