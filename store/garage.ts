'use client';

import { create } from 'zustand';
import { z } from 'zod';

export const garageConfigSchema = z.object({
  modelId: z.literal('ng-classic-77'),
  paintColor: z.enum(['silver', 'racing-orange']),
  wheelId: z.enum(['classic', 'mesh', 'aero']),
  liveryId: z.enum(['stripes-77', 'clean']),
  decalId: z.enum(['number-77', 'none']),
  plateText: z.string().trim().min(1).max(8).regex(/^[A-Z0-9-]+$/),
  sceneId: z.enum(['sunset', 'studio', 'night', 'paddock']),
  viewId: z.enum(['three-quarter', 'front', 'side', 'rear']),
  assetVersion: z.literal('garage-2d-v1'),
});

export type GarageConfig = z.infer<typeof garageConfigSchema>;
export const initialGarageConfig: GarageConfig = {
  modelId: 'ng-classic-77', paintColor: 'silver', wheelId: 'classic',
  liveryId: 'stripes-77', decalId: 'number-77', plateText: 'NEON77',
  sceneId: 'sunset', viewId: 'three-quarter', assetVersion: 'garage-2d-v1',
};

type Store = {
  config: GarageConfig; past: GarageConfig[]; future: GarageConfig[];
  set: <K extends keyof GarageConfig>(key: K, value: GarageConfig[K]) => void;
  replace: (value: GarageConfig) => void; reset: () => void; undo: () => void;
  redo: () => void; restore: (value: unknown) => boolean;
};

function migrateLegacy(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value;
  const legacy = value as Record<string, unknown>;
  if (legacy.assetVersion) return value;
  return {
    modelId: 'ng-classic-77',
    paintColor: legacy.paintColor === '#ff5b20' ? 'racing-orange' : 'silver',
    wheelId: ['classic', 'mesh', 'aero'].includes(String(legacy.wheelId)) ? legacy.wheelId : 'classic',
    liveryId: legacy.stripes === false ? 'clean' : 'stripes-77',
    decalId: Array.isArray(legacy.decals) && legacy.decals.some((item) => /^\d{1,3}$/.test(String(item))) ? 'number-77' : 'none',
    plateText: legacy.licensePlate || 'NEON77',
    sceneId: ['sunset', 'studio', 'night', 'paddock'].includes(String(legacy.environment)) ? legacy.environment : 'sunset',
    viewId: ({ free: 'three-quarter', front: 'front', back: 'rear', left: 'side', right: 'side' } as Record<string, string>)[String(legacy.cameraPreset)] || 'three-quarter',
    assetVersion: 'garage-2d-v1',
  };
}

export const useGarage = create<Store>((set, get) => ({
  config: initialGarageConfig, past: [], future: [],
  set: (key, value) => set((state) => ({ past: [...state.past, state.config].slice(-30), config: { ...state.config, [key]: value }, future: [] })),
  replace: (value) => set((state) => ({ past: [...state.past, state.config].slice(-30), config: value, future: [] })),
  reset: () => set((state) => ({ past: [...state.past, state.config].slice(-30), config: initialGarageConfig, future: [] })),
  undo: () => { const state = get(); const previous = state.past.at(-1); if (previous) set({ config: previous, past: state.past.slice(0, -1), future: [state.config, ...state.future] }); },
  redo: () => { const state = get(); const next = state.future[0]; if (next) set({ config: next, past: [...state.past, state.config].slice(-30), future: state.future.slice(1) }); },
  restore: (value) => {
    const result = garageConfigSchema.safeParse(migrateLegacy(value));
    if (!result.success) return false;
    set((state) => ({ config: result.data, past: [...state.past, state.config].slice(-30), future: [] }));
    return true;
  },
}));
