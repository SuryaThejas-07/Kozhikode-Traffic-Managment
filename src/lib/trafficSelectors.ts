import { incidents, junctions, roads } from '../data/trafficNetwork';

export const searchTraffic = (query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return { junctions, roads, incidents };
  }

  return {
    junctions: junctions.filter((junction) => `${junction.name} ${junction.zone}`.toLowerCase().includes(normalized)),
    roads: roads.filter((road) => `${road.name} ${road.corridor}`.toLowerCase().includes(normalized)),
    incidents: incidents.filter((incident) => `${incident.title} ${incident.location}`.toLowerCase().includes(normalized)),
  };
};
