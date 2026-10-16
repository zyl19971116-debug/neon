import { beforeEach, describe, expect, it } from 'vitest';
import { garageConfigSchema, initialGarageConfig, useGarage } from './garage';

describe('garage 2D configuration', () => {
  beforeEach(() => useGarage.setState({ config: initialGarageConfig, past: [], future: [] }));
  it('validates the versioned default configuration', () => expect(garageConfigSchema.safeParse(useGarage.getState().config).success).toBe(true));
  it('rejects unsafe plates', () => expect(garageConfigSchema.safeParse({ ...useGarage.getState().config, plateText: '<script>' }).success).toBe(false));
  it('supports undo and redo', () => {
    useGarage.getState().set('paintColor', 'racing-orange');
    useGarage.getState().undo();
    expect(useGarage.getState().config.paintColor).toBe('silver');
    useGarage.getState().redo();
    expect(useGarage.getState().config.paintColor).toBe('racing-orange');
  });
  it('migrates a compatible version 1 draft', () => {
    expect(useGarage.getState().restore({ modelId: 'ng-classic-77', paintColor: '#ff5b20', wheelId: 'mesh', decals: ['77'], stripes: true, licensePlate: 'OLD77', environment: 'night', cameraPreset: 'front', configurationVersion: 1 })).toBe(true);
    expect(useGarage.getState().config).toMatchObject({ paintColor: 'racing-orange', wheelId: 'mesh', plateText: 'OLD77', sceneId: 'night', viewId: 'front' });
  });
});
