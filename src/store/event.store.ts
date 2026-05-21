import { create } from 'zustand';
import { DEFAULT_EVENTS } from '../data/mock';
import type { EventPlan } from '../types/traffic';

export const useEventStore = create<{
  events: EventPlan[];
  selectedDispersal: 0 | 30 | 60;
  drawerOpen: boolean;
  setEvents: (events: EventPlan[]) => void;
  setSelectedDispersal: (value: 0 | 30 | 60) => void;
  setDrawerOpen: (value: boolean) => void;
}>((set) => ({
  events: DEFAULT_EVENTS,
  selectedDispersal: 30,
  drawerOpen: false,
  setEvents: (events) => set({ events }),
  setSelectedDispersal: (selectedDispersal) => set({ selectedDispersal }),
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
}));
