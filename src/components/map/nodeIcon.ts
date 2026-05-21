import L from 'leaflet';
import type { JunctionNode } from '../../types/traffic';

const colorBySignalClass: Record<JunctionNode['signalClass'], string> = {
  signalized: '#2563eb',
  connector: '#0f766e',
  bottleneck: '#dc2626',
  transit: '#7c3aed',
  'event-aware': '#d97706',
};

export const createNodeIcon = (signalClass: JunctionNode['signalClass']) => {
  const color = colorBySignalClass[signalClass];

  return L.divIcon({
    className: '',
    iconSize: [26, 34],
    iconAnchor: [13, 32],
    popupAnchor: [0, -28],
    html: `
      <div style="position:relative;width:26px;height:34px;transform:translateY(-2px);">
        <div style="position:absolute;left:50%;top:1px;width:22px;height:22px;transform:translateX(-50%);border-radius:9999px;background:${color};border:2px solid rgba(255,255,255,0.96);box-shadow:0 10px 18px rgba(15,23,42,0.22);"></div>
        <div style="position:absolute;left:50%;top:7px;width:8px;height:8px;transform:translateX(-50%);border-radius:9999px;background:rgba(255,255,255,0.96);"></div>
        <div style="position:absolute;left:50%;bottom:0;width:0;height:0;transform:translateX(-50%);border-left:7px solid transparent;border-right:7px solid transparent;border-top:10px solid ${color};filter:drop-shadow(0 4px 6px rgba(15,23,42,0.15));"></div>
      </div>
    `,
  });
};