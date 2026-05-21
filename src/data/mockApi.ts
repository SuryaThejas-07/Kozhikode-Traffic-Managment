import {
  demandCurve,
  events,
  forecastSeries,
  incidents,
  junctions,
  liveSnapshot,
  liveTrafficMatrix,
  recommendations,
  roads,
  signalPlans,
  systemMetrics,
} from './trafficNetwork';

const pause = (ms: number) => new Promise((resolve) => globalThis.setTimeout(resolve, ms));

export const mockApi = {
  async getLiveTraffic() {
    await pause(120);
    return { snapshot: liveSnapshot, junctions, roads: liveTrafficMatrix };
  },
  async getForecast() {
    await pause(140);
    return { forecastSeries, demandCurve };
  },
  async getIncidents() {
    await pause(110);
    return incidents;
  },
  async getEvents() {
    await pause(110);
    return events;
  },
  async getRecommendations() {
    await pause(130);
    return recommendations;
  },
  async getSignals() {
    await pause(90);
    return signalPlans;
  },
  async getSystemMetrics() {
    await pause(90);
    return systemMetrics;
  },
};
