import { GarageConfig, initialGarageConfig } from './configuration-schema';

export type AssetOption = { id: string; label: string; available: boolean; thumbnail?: string; swatch?: string; note?: string };
export type ViewLayout = { width: 1536; height: 1024; car: { x: number; y: number; scale: number }; wheels: { rear: [number, number]; front: [number, number] }; layers: string[] };

export const viewLayouts: Record<GarageConfig['viewId'], ViewLayout> = {
  'three-quarter': { width: 1536, height: 1024, car: { x: 0, y: 0, scale: 1 }, wheels: { rear: [174, 630], front: [690, 650] }, layers: ['environment', 'body', 'rear-wheel', 'body-mask', 'windows', 'livery', 'front-wheel', 'lights', 'spoiler', 'plate'] },
  front: { width: 1536, height: 1024, car: { x: 0, y: 0, scale: 1 }, wheels: { rear: [360, 720], front: [1176, 720] }, layers: ['environment', 'body', 'wheels', 'lights', 'livery', 'plate'] },
  side: { width: 1536, height: 1024, car: { x: 0, y: 0, scale: 1 }, wheels: { rear: [337, 630], front: [1140, 630] }, layers: ['environment', 'rear-wheel', 'body', 'livery', 'windows', 'front-wheel', 'spoiler', 'plate'] },
  rear: { width: 1536, height: 1024, car: { x: 0, y: 0, scale: 1 }, wheels: { rear: [354, 720], front: [1182, 720] }, layers: ['environment', 'body', 'wheels', 'spoiler', 'plate'] },
};

const unavailable = (id: string, label: string): AssetOption => ({ id, label, available: false, note: 'UNAVAILABLE · MATCHED IMAGE REQUIRED' });
export const customizationManifest = {
  paint: [
    { id: 'silver', label: 'Silver Alloy', available: true, swatch: '#bfc5c7', thumbnail: '/assets/garage-2d/cars/ng77-silver-studio.webp' },
    { id: 'racing-orange', label: 'Racing Orange', available: true, swatch: '#e54a16', thumbnail: '/assets/garage-2d/cars/ng77-orange-studio.webp' },
    unavailable('pearl-white', 'Pearl White'), unavailable('midnight-black', 'Midnight Black'), unavailable('heritage-red', 'Heritage Red'), unavailable('petrol-teal', 'Petrol Teal'), unavailable('sunset-yellow', 'Sunset Yellow'), unavailable('british-racing-green', 'British Racing Green'), unavailable('ocean-blue', 'Ocean Blue'), unavailable('candy-purple', 'Candy Purple'), unavailable('gunmetal-grey', 'Gunmetal Grey'), unavailable('rose-gold', 'Rose Gold'),
  ],
  finish: [unavailable('gloss', 'Gloss'), unavailable('matte', 'Matte'), { id: 'metallic', label: 'Metallic', available: true, thumbnail: '/assets/garage-2d/cars/ng77-silver-studio.webp' }],
  wheels: [
    { id: 'classic', label: 'Classic', available: true, thumbnail: '/assets/garage-2d/wheels/classic.webp' },
    { id: 'mesh', label: 'Mesh', available: true, thumbnail: '/assets/garage-2d/wheels/mesh.webp' },
    { id: 'aero', label: 'Aero', available: true, thumbnail: '/assets/garage-2d/wheels/aero.webp' },
    unavailable('deep-dish', 'Deep Dish'), unavailable('racing', 'Racing'),
  ],
  wheelFinish: [{ id: 'black', label: 'Black', available: true, swatch: '#111516' }, unavailable('silver', 'Silver'), unavailable('gold', 'Gold'), unavailable('bronze', 'Bronze'), unavailable('white', 'White'), unavailable('orange', 'Orange')],
  spoilers: [
    unavailable('none', 'None'), { id: 'ducktail', label: 'Ducktail', available: true, thumbnail: '/assets/garage-2d/spoilers/ducktail.webp' }, unavailable('street', 'Street'), { id: 'gt-wing', label: 'GT Wing', available: true, thumbnail: '/assets/garage-2d/cars/ng77-silver-studio.webp' },
  ],
  bodykits: [unavailable('stock', 'Stock'), unavailable('street', 'Street'), { id: 'widebody', label: 'Widebody', available: true, thumbnail: '/assets/garage-2d/cars/ng77-silver-studio.webp' }, { id: 'track', label: 'Track', available: true, thumbnail: '/assets/garage-2d/bodykits/track.webp' }],
  liveries: [
    { id: 'clean', label: 'Clean', available: true, thumbnail: '/assets/garage-2d/decals/clean.webp' },
    unavailable('classic-stripe', 'Classic Stripe'), unavailable('double-stripe', 'Double Stripe'),
    { id: 'number-77', label: 'Number 77', available: true, thumbnail: '/assets/garage-2d/decals/stripes-77.webp' },
    unavailable('flame', 'Flame'), unavailable('retro-racing', 'Retro Racing'), unavailable('geometric', 'Geometric'), unavailable('street-style', 'Street Style'),
  ],
  lights: [{ id: 'classic-white', label: 'Classic White', available: true, thumbnail: '/assets/garage-2d/cars/ng77-silver-studio.webp' }, { id: 'vintage-yellow', label: 'Vintage Yellow', available: true, thumbnail: '/assets/garage-2d/lights/vintage-yellow.webp' }, unavailable('led-white', 'LED White')],
  windows: [{ id: 'clear', label: 'Clear', available: true, thumbnail: '/assets/garage-2d/cars/ng77-silver-studio.webp' }, unavailable('light', 'Light'), { id: 'dark', label: 'Dark', available: true, thumbnail: '/assets/garage-2d/windows/dark.webp' }, unavailable('blackout', 'Blackout')],
  rideHeight: [unavailable('stock', 'Stock'), { id: 'sport', label: 'Sport', available: true, thumbnail: '/assets/garage-2d/cars/ng77-silver-studio.webp' }, { id: 'low', label: 'Low', available: true, thumbnail: '/assets/garage-2d/cars/ride-low.webp' }],
  environments: [
    { id: 'sunset', label: 'Sunset Garage', available: true, thumbnail: '/assets/garage-2d/cars/ng77-three-quarter-sunset.webp' },
    { id: 'studio', label: 'Photo Studio', available: true, thumbnail: '/assets/garage-2d/cars/ng77-silver-studio.webp' },
    { id: 'night', label: 'Night Street', available: true, thumbnail: '/assets/garage-2d/backgrounds/night-street.webp' },
    { id: 'paddock', label: 'Race Paddock', available: true, thumbnail: '/assets/garage-2d/backgrounds/race-paddock.webp' },
    { id: 'coastal', label: 'Coastal Highway', available: true, thumbnail: '/assets/garage-2d/backgrounds/coastal-highway.webp' },
  ],
} satisfies Record<string, AssetOption[]>;

const base = '/assets/garage-2d';
export const allRenderableAssets = [
  `${base}/cars/ng77-three-quarter-sunset.webp`, `${base}/cars/ng77-front-sunset.webp`, `${base}/cars/ng77-side-sunset.webp`, `${base}/cars/ng77-rear-sunset.webp`,
  `${base}/cars/ng77-silver-studio.webp`, `${base}/cars/ng77-orange-studio.webp`, `${base}/cars/ng77-mesh-studio.webp`, `${base}/cars/ng77-aero-studio.webp`, `${base}/cars/ng77-clean-studio.webp`,
  `${base}/spoilers/ducktail.webp`, `${base}/bodykits/track.webp`, `${base}/lights/vintage-yellow.webp`, `${base}/windows/dark.webp`, `${base}/cars/ride-low.webp`,
  `${base}/backgrounds/night-street.webp`, `${base}/backgrounds/race-paddock.webp`, `${base}/backgrounds/coastal-highway.webp`,
];

export function canonicalConfig(overrides: Partial<GarageConfig>): GarageConfig {
  return { ...initialGarageConfig, sceneId: 'studio', viewId: 'three-quarter', ...overrides };
}

export function resolveGarageAsset(config: GarageConfig) {
  if (config.viewId !== 'three-quarter') return `${base}/cars/ng77-${config.viewId}-sunset.webp`;
  if (config.sceneId === 'sunset') return `${base}/cars/ng77-three-quarter-sunset.webp`;
  if (config.sceneId === 'night') return `${base}/backgrounds/night-street.webp`;
  if (config.sceneId === 'paddock') return `${base}/backgrounds/race-paddock.webp`;
  if (config.sceneId === 'coastal') return `${base}/backgrounds/coastal-highway.webp`;
  if (config.paintColor === 'racing-orange') return `${base}/cars/ng77-orange-studio.webp`;
  if (config.wheelId === 'mesh') return `${base}/cars/ng77-mesh-studio.webp`;
  if (config.wheelId === 'aero') return `${base}/cars/ng77-aero-studio.webp`;
  if (config.spoilerId === 'ducktail') return `${base}/spoilers/ducktail.webp`;
  if (config.bodyKitId === 'track') return `${base}/bodykits/track.webp`;
  if (config.liveryId === 'clean') return `${base}/cars/ng77-clean-studio.webp`;
  if (config.headlightId === 'vintage-yellow') return `${base}/lights/vintage-yellow.webp`;
  if (config.windowTint === 'dark') return `${base}/windows/dark.webp`;
  if (config.rideHeight === 'low') return `${base}/cars/ride-low.webp`;
  return `${base}/cars/ng77-silver-studio.webp`;
}

export function randomSupportedConfig(random = Math.random): GarageConfig {
  const pools: Partial<GarageConfig>[] = [
    { paintColor: random() > .5 ? 'silver' : 'racing-orange' },
    { wheelId: (['classic', 'mesh', 'aero'] as const)[Math.floor(random() * 3)] },
    { spoilerId: random() > .5 ? 'gt-wing' : 'ducktail' },
    { bodyKitId: random() > .5 ? 'widebody' : 'track' },
    { liveryId: random() > .5 ? 'number-77' : 'clean' },
    { headlightId: random() > .5 ? 'classic-white' : 'vintage-yellow' },
    { windowTint: random() > .5 ? 'clear' : 'dark' },
    { rideHeight: random() > .5 ? 'sport' : 'low' },
    { sceneId: (['sunset', 'studio', 'night', 'paddock', 'coastal'] as const)[Math.floor(random() * 5)] },
  ];
  return canonicalConfig(pools[Math.floor(random() * pools.length)]);
}
