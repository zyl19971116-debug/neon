import { z } from 'zod';

export const paintIds = ['silver', 'racing-orange', 'pearl-white', 'midnight-black', 'heritage-red', 'petrol-teal', 'sunset-yellow', 'british-racing-green', 'ocean-blue', 'candy-purple', 'gunmetal-grey', 'rose-gold'] as const;
export const finishIds = ['gloss', 'matte', 'metallic'] as const;
export const wheelIds = ['classic', 'mesh', 'aero', 'deep-dish', 'racing'] as const;
export const wheelFinishIds = ['silver', 'black', 'gold', 'bronze', 'white', 'orange'] as const;
export const spoilerIds = ['none', 'ducktail', 'street', 'gt-wing'] as const;
export const bodyKitIds = ['stock', 'street', 'widebody', 'track'] as const;
export const liveryIds = ['clean', 'classic-stripe', 'double-stripe', 'number-77', 'flame', 'retro-racing', 'geometric', 'street-style'] as const;
export const headlightIds = ['classic-white', 'vintage-yellow', 'led-white'] as const;
export const tintIds = ['clear', 'light', 'dark', 'blackout'] as const;
export const rideHeightIds = ['stock', 'sport', 'low'] as const;
export const environmentIds = ['sunset', 'studio', 'night', 'paddock', 'coastal'] as const;
export const viewIds = ['three-quarter', 'front', 'side', 'rear'] as const;

export const garageConfigSchema = z.object({
  modelId: z.literal('ng-classic-77'),
  paintColor: z.enum(paintIds),
  paintFinish: z.enum(finishIds),
  wheelId: z.enum(wheelIds),
  wheelFinish: z.enum(wheelFinishIds),
  spoilerId: z.enum(spoilerIds),
  bodyKitId: z.enum(bodyKitIds),
  liveryId: z.enum(liveryIds),
  raceNumber: z.number().int().min(1).max(999),
  headlightId: z.enum(headlightIds),
  windowTint: z.enum(tintIds),
  rideHeight: z.enum(rideHeightIds),
  plateText: z.string().trim().min(1).max(8).regex(/^[A-Z0-9-]+$/),
  sceneId: z.enum(environmentIds),
  viewId: z.enum(viewIds),
  assetVersion: z.literal('garage-2d-v2'),
});

export type GarageConfig = z.infer<typeof garageConfigSchema>;

export const initialGarageConfig: GarageConfig = {
  modelId: 'ng-classic-77', paintColor: 'silver', paintFinish: 'metallic',
  wheelId: 'classic', wheelFinish: 'black', spoilerId: 'gt-wing',
  bodyKitId: 'widebody', liveryId: 'number-77', raceNumber: 77,
  headlightId: 'classic-white', windowTint: 'clear', rideHeight: 'sport',
  plateText: 'NEON77', sceneId: 'sunset', viewId: 'three-quarter',
  assetVersion: 'garage-2d-v2',
};
