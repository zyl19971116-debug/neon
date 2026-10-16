'use client';

import { create } from 'zustand';
import { GarageConfig, garageConfigSchema, initialGarageConfig } from '../lib/garage/configuration-schema';
export { garageConfigSchema, initialGarageConfig };
export type { GarageConfig };

type Store = {
  config: GarageConfig; past: GarageConfig[]; future: GarageConfig[];
  set: <K extends keyof GarageConfig>(key: K, value: GarageConfig[K]) => void;
  replace: (value: GarageConfig) => void; reset: () => void; undo: () => void;
  redo: () => void; restore: (value: unknown) => boolean;
};

function migrate(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value;
  const legacy = value as Record<string, unknown>;
  if (legacy.assetVersion === 'garage-2d-v2') return value;
  const v1 = legacy.assetVersion === 'garage-2d-v1';
  return {
    ...initialGarageConfig,
    paintColor: legacy.paintColor === 'racing-orange' || legacy.paintColor === '#ff5b20' ? 'racing-orange' : 'silver',
    wheelId: ['classic', 'mesh', 'aero'].includes(String(legacy.wheelId)) ? legacy.wheelId : 'classic',
    liveryId: legacy.liveryId === 'clean' || legacy.stripes === false ? 'clean' : 'number-77',
    raceNumber: 77,
    plateText: legacy.plateText || legacy.licensePlate || 'NEON77',
    sceneId: ['sunset', 'studio', 'night', 'paddock'].includes(String(v1 ? legacy.sceneId : legacy.environment)) ? (v1 ? legacy.sceneId : legacy.environment) : 'sunset',
    viewId: v1 ? legacy.viewId : ({ free: 'three-quarter', front: 'front', back: 'rear', left: 'side', right: 'side' } as Record<string, string>)[String(legacy.cameraPreset)] || 'three-quarter',
    assetVersion: 'garage-2d-v2',
  };
}

export const useGarage = create<Store>((set, get) => ({
  config: initialGarageConfig, past: [], future: [],
  set: (key, value) => set((state) => ({ past: [...state.past, state.config].slice(-40), config: { ...state.config, [key]: value }, future: [] })),
  replace: (value) => set((state) => ({ past: [...state.past, state.config].slice(-40), config: value, future: [] })),
  reset: () => set((state) => ({ past: [...state.past, state.config].slice(-40), config: initialGarageConfig, future: [] })),
  undo: () => { const state = get(); const previous = state.past.at(-1); if (previous) set({ config: previous, past: state.past.slice(0, -1), future: [state.config, ...state.future] }); },
  redo: () => { const state = get(); const next = state.future[0]; if (next) set({ config: next, past: [...state.past, state.config].slice(-40), future: state.future.slice(1) }); },
  restore: (value) => {
    const result = garageConfigSchema.safeParse(migrate(value));
    if (!result.success) return false;
    set((state) => ({ config: result.data, past: [...state.past, state.config].slice(-40), future: [] }));
    return true;
  },
}));
