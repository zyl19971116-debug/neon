'use client';

import Image from 'next/image';
import { RefObject, useEffect } from 'react';
import { allRenderableAssets, resolveGarageAsset, viewLayouts } from '@/lib/garage/asset-manifest';
import { GarageConfig } from '@/lib/garage/configuration-schema';
import styles from '@/app/garage/garage.module.css';

export function CarLayerRenderer({ config, imageRef }: { config: GarageConfig; imageRef: RefObject<HTMLImageElement> }) {
  const source = resolveGarageAsset(config);
  const layout = viewLayouts[config.viewId];
  useEffect(() => {
    allRenderableAssets.forEach((url) => { const image = new window.Image(); image.src = url; });
  }, []);
  return <div className={styles.compositor} data-asset={source} data-layer-order={layout.layers.join(',')}>
    <Image ref={imageRef} key={source} data-testid="garage-car-image" src={source} alt={`NG Classic 77 ${config.viewId} ${config.sceneId}`} fill priority sizes="(max-width: 760px) 100vw, (max-width: 1100px) 60vw, 70vw" className={styles.heroImage} />
    <div className={styles.stageShade} />
    {config.liveryId === 'number-77' && config.raceNumber !== 77 && config.viewId === 'three-quarter' && <div className={styles.raceNumber} aria-label="Race number overlay">{config.raceNumber}</div>}
    <div className={styles.plate}>{config.plateText}</div>
  </div>;
}
