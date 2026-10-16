'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Check, LockKeyhole } from 'lucide-react';
import { AssetOption, canonicalConfig, customizationManifest } from '@/lib/garage/asset-manifest';
import { GarageConfig } from '@/lib/garage/configuration-schema';
import styles from '@/app/garage/garage.module.css';

const categories = ['paint', 'wheels', 'wheel-finish', 'spoiler', 'body-kit', 'livery', 'headlights', 'window-tint', 'ride-height', 'plate', 'environment'] as const;
type Category = typeof categories[number];
const titles: Record<Category, string> = {
  paint: 'PAINT', wheels: 'WHEELS', 'wheel-finish': 'WHEEL FINISH', spoiler: 'SPOILER',
  'body-kit': 'BODY KIT', livery: 'LIVERY', headlights: 'HEADLIGHTS', 'window-tint': 'WINDOW TINT',
  'ride-height': 'RIDE HEIGHT', plate: 'PLATE', environment: 'ENVIRONMENT',
};

export function CustomizationPanel({ config, onChoose }: { config: GarageConfig; onChoose: (config: GarageConfig, message?: string) => void }) {
  const [active, setActive] = useState<Category>('paint');
  const selected = active === 'paint' ? config.paintColor : active === 'wheels' ? config.wheelId : active === 'wheel-finish' ? config.wheelFinish : active === 'spoiler' ? config.spoilerId : active === 'body-kit' ? config.bodyKitId : active === 'livery' ? config.liveryId : active === 'headlights' ? config.headlightId : active === 'window-tint' ? config.windowTint : active === 'ride-height' ? config.rideHeight : active === 'environment' ? config.sceneId : '';
  const options: AssetOption[] = active === 'paint' ? customizationManifest.paint : active === 'wheels' ? customizationManifest.wheels : active === 'wheel-finish' ? customizationManifest.wheelFinish : active === 'spoiler' ? customizationManifest.spoilers : active === 'body-kit' ? customizationManifest.bodykits : active === 'livery' ? customizationManifest.liveries : active === 'headlights' ? customizationManifest.lights : active === 'window-tint' ? customizationManifest.windows : active === 'ride-height' ? customizationManifest.rideHeight : active === 'environment' ? customizationManifest.environments : [];

  const apply = (option: AssetOption) => {
    if (!option.available) return;
    const id = option.id;
    const next = active === 'paint' ? canonicalConfig({ paintColor: id as GarageConfig['paintColor'] })
      : active === 'wheels' ? canonicalConfig({ wheelId: id as GarageConfig['wheelId'] })
      : active === 'wheel-finish' ? canonicalConfig({ wheelFinish: id as GarageConfig['wheelFinish'] })
      : active === 'spoiler' ? canonicalConfig({ spoilerId: id as GarageConfig['spoilerId'] })
      : active === 'body-kit' ? canonicalConfig({ bodyKitId: id as GarageConfig['bodyKitId'] })
      : active === 'livery' ? canonicalConfig({ liveryId: id as GarageConfig['liveryId'] })
      : active === 'headlights' ? canonicalConfig({ headlightId: id as GarageConfig['headlightId'] })
      : active === 'window-tint' ? canonicalConfig({ windowTint: id as GarageConfig['windowTint'] })
      : active === 'ride-height' ? canonicalConfig({ rideHeight: id as GarageConfig['rideHeight'] })
      : canonicalConfig({ sceneId: id as GarageConfig['sceneId'] });
    onChoose(next, 'VERIFIED RENDER LOADED · OTHER CATEGORIES RESET TO MATCH');
  };

  return <aside className={styles.configurator}>
    <div className={styles.configHead}><span className={styles.eyebrow}>02 / CONFIGURE</span><h2>CUSTOMIZE<br />YOUR RIDE</h2></div>
    <nav className={styles.categoryRail}>{categories.map((category) => <button key={category} className={active === category ? styles.active : ''} onClick={() => setActive(category)}>{titles[category]}</button>)}</nav>
    <div className={styles.controls}>
      <div className={styles.controlTitle}><b>{titles[active]}</b><span>V2 VERIFIED ASSETS</span></div>
      {active === 'plate' ? <PlateEditor config={config} onChoose={onChoose} /> : <>
        <div className={styles.assetOptions}>{options.map((option) => <button key={option.id} disabled={!option.available} className={selected === option.id ? styles.selected : ''} onClick={() => apply(option)} title={option.note}>
          {option.thumbnail && <span className={styles.optionImage}><Image src={option.thumbnail} alt="" fill sizes="150px" /></span>}
          {option.swatch && <i className={styles.colorOrb} style={{ background: option.swatch }} />}
          <span className={styles.optionLabel}><b>{option.label}</b><small>{option.available ? 'AVAILABLE' : 'UNAVAILABLE'}</small></span>
          {selected === option.id && option.available && <Check size={14} />}
          {!option.available && <LockKeyhole size={13} />}
        </button>)}</div>
        {active === 'paint' && <FinishSelector config={config} onChoose={onChoose} />}
        {active === 'livery' && config.liveryId === 'number-77' && <label className={styles.field}>RACE NUMBER 1–999<input aria-label="Race number" type="number" min="1" max="999" value={config.raceNumber} onChange={(event) => onChoose({ ...config, raceNumber: Math.max(1, Math.min(999, Number(event.target.value) || 1)) })} /></label>}
        <p className={styles.helper}>Locked options have no matched photographic asset and cannot be selected.</p>
      </>}
    </div>
  </aside>;
}

function FinishSelector({ config, onChoose }: { config: GarageConfig; onChoose: (config: GarageConfig, message?: string) => void }) {
  return <div className={styles.finishRow}>{customizationManifest.finish.map((option) => <button key={option.id} disabled={!option.available} className={config.paintFinish === option.id ? styles.selected : ''} onClick={() => option.available && onChoose(canonicalConfig({ paintColor: config.paintColor, paintFinish: option.id as GarageConfig['paintFinish'] }))}>{option.label}{!option.available && <LockKeyhole size={11} />}</button>)}</div>;
}

function PlateEditor({ config, onChoose }: { config: GarageConfig; onChoose: (config: GarageConfig) => void }) {
  return <><label className={styles.field}>LICENSE PLATE<input aria-label="License plate" maxLength={8} value={config.plateText} onChange={(event) => onChoose({ ...config, plateText: event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '') || 'NEON77' })} /></label><div className={styles.platePreview}>{config.plateText}</div><p className={styles.helper}>1–8 characters. Only A–Z, 0–9, and hyphen are stored and exported.</p></>;
}
