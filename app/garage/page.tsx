'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Camera, Check, Coins, Download, Plus, Redo2, RotateCcw, Save, Share2, Undo2, Upload } from 'lucide-react';
import { useAccount } from 'wagmi';
import { GarageConfig, garageConfigSchema, initialGarageConfig, useGarage } from '@/store/garage';
import styles from './garage.module.css';

type Tab = 'paint' | 'wheels' | 'livery' | 'details' | 'scene';
const draftKey = 'neon-garage-2d-draft';
const views: GarageConfig['viewId'][] = ['front', 'side', 'rear', 'three-quarter'];
const sceneNames = { sunset: 'SUNSET GARAGE', studio: 'PHOTO STUDIO', night: 'NIGHT STREET', paddock: 'RACE PADDOCK' } as const;
const viewNames = { front: 'FRONT', side: 'SIDE', rear: 'REAR', 'three-quarter': 'THREE QUARTER' } as const;

const assets = {
  default: '/assets/garage-2d/cars/ng77-three-quarter-sunset.webp',
  front: '/assets/garage-2d/cars/ng77-front-sunset.webp',
  side: '/assets/garage-2d/cars/ng77-side-sunset.webp',
  rear: '/assets/garage-2d/cars/ng77-rear-sunset.webp',
  studio: '/assets/garage-2d/cars/ng77-silver-studio.webp',
  orange: '/assets/garage-2d/cars/ng77-orange-studio.webp',
  mesh: '/assets/garage-2d/cars/ng77-mesh-studio.webp',
  aero: '/assets/garage-2d/cars/ng77-aero-studio.webp',
  clean: '/assets/garage-2d/cars/ng77-clean-studio.webp',
  night: '/assets/garage-2d/backgrounds/night-street.webp',
  paddock: '/assets/garage-2d/backgrounds/race-paddock.webp',
} as const;

function resolveAsset(config: GarageConfig) {
  if (config.viewId !== 'three-quarter') return assets[config.viewId];
  if (config.sceneId === 'night') return assets.night;
  if (config.sceneId === 'paddock') return assets.paddock;
  if (config.sceneId === 'sunset') return assets.default;
  if (config.paintColor === 'racing-orange') return assets.orange;
  if (config.wheelId === 'mesh') return assets.mesh;
  if (config.wheelId === 'aero') return assets.aero;
  if (config.liveryId === 'clean') return assets.clean;
  return assets.studio;
}

function canonical(overrides: Partial<GarageConfig>): GarageConfig {
  return { ...initialGarageConfig, sceneId: 'studio', viewId: 'three-quarter', ...overrides };
}

export default function Garage() {
  const { config, replace, reset, restore, undo, redo, past, future } = useGarage();
  const { isConnected } = useAccount();
  const [tab, setTab] = useState<Tab>('paint');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState('');
  const imageRef = useRef<HTMLImageElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const imageSrc = resolveAsset(config);
  const contractReady = Boolean(process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS);

  useEffect(() => {
    Object.values(assets).forEach((source) => { const image = new window.Image(); image.src = source; });
    return () => clearTimeout(timer.current);
  }, []);

  const flash = (text: string) => {
    clearTimeout(timer.current); setMessage(text);
    timer.current = setTimeout(() => setMessage(''), 2800);
  };
  const choose = (next: GarageConfig, note?: string) => {
    replace(next);
    if (note) flash(note);
  };
  const save = () => {
    setBusy('save');
    const result = garageConfigSchema.safeParse(config);
    if (!result.success) { setBusy(''); return flash('DRAFT INVALID — NOT SAVED'); }
    localStorage.setItem(draftKey, JSON.stringify(result.data));
    setTimeout(() => { setBusy(''); flash('DRAFT SAVED LOCALLY'); }, 220);
  };
  const restoreDraft = () => {
    const raw = localStorage.getItem(draftKey);
    if (!raw) return flash('NO SAVED DRAFT FOUND');
    try { flash(restore(JSON.parse(raw)) ? 'DRAFT RESTORED' : 'DRAFT IS NOT COMPATIBLE'); } catch { flash('DRAFT COULD NOT BE READ'); }
  };
  const capture = async () => {
    const image = imageRef.current;
    if (!image?.complete || !image.naturalWidth) return flash('IMAGE IS STILL LOADING');
    setBusy('capture');
    try {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas unavailable');
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      context.fillStyle = '#f5ebdd'; context.strokeStyle = '#081b1d'; context.lineWidth = 6;
      context.fillRect(canvas.width * .76, canvas.height * .82, canvas.width * .15, canvas.height * .065);
      context.strokeRect(canvas.width * .76, canvas.height * .82, canvas.width * .15, canvas.height * .065);
      context.fillStyle = '#081b1d'; context.font = `900 ${Math.round(canvas.height * .035)}px Arial`; context.textAlign = 'center';
      context.fillText(config.plateText, canvas.width * .835, canvas.height * .865);
      const link = document.createElement('a'); link.download = `ng-classic-77-${Date.now()}.png`; link.href = canvas.toDataURL('image/png'); link.click();
      flash('CURRENT 2D COMPOSITION EXPORTED');
    } catch { flash('CAPTURE FAILED'); } finally { setBusy(''); }
  };
  const share = async () => {
    const url = `${location.origin}/garage?build=${encodeURIComponent(btoa(JSON.stringify(config)))}`;
    try {
      if (navigator.share) await navigator.share({ title: 'NG CLASSIC 77', url });
      else await navigator.clipboard.writeText(url);
      flash('BUILD LINK READY');
    } catch { flash('SHARE CANCELLED OR UNAVAILABLE'); }
  };
  const mint = () => {
    if (!isConnected) return flash('CONNECT A WALLET BEFORE MINTING');
    if (!contractReady) return flash('NFT CONTRACT IS NOT DEPLOYED');
    flash('MINT INTERFACE IS AVAILABLE THROUGH THE EXISTING CONTRACT FLOW');
  };

  return <main className={styles.page} data-config={JSON.stringify(config)}>
    <header className={styles.workHeader}>
      <div><span>NEON GARAGE / 2D IMAGE STUDIO</span><h1>BUILD YOUR ICON</h1></div>
      <div className={styles.assetStatus}><i />ASSET PACK <b>GARAGE-2D-V1</b></div>
    </header>
    <div className={styles.studio}>
      <aside className={styles.garageRail}>
        <div><span className={styles.eyebrow}>01 / COLLECTION</span><h2>MY GARAGE</h2></div>
        <button className={styles.vehicleCard} aria-pressed="true">
          <div className={styles.thumb}><Image src="/assets/garage-2d/previews/ng77-thumb.webp" alt="NG Classic 77 thumbnail" fill sizes="220px" /><span>ACTIVE</span></div>
          <b>NG CLASSIC 77</b><small>1970s WIDEBODY RACING COUPÉ</small><em>2D ASSET READY</em>
        </button>
        <button className={styles.addVehicle} disabled title="Additional vehicle photography is required"><Plus size={18} /><span><b>ADD VEHICLE</b><small>Asset pack required</small></span></button>
        <div className={styles.railNote}><b>REAL IMAGE MODE</b><p>No WebGL, GLB, or simulated rotation. Unsupported combinations are locked to verified renders.</p></div>
      </aside>

      <section className={styles.stage}>
        <Image ref={imageRef} key={imageSrc} data-testid="garage-car-image" src={imageSrc} alt={`NG Classic 77 — ${sceneNames[config.sceneId]} — ${viewNames[config.viewId]}`} fill priority sizes="(max-width: 760px) 100vw, (max-width: 1100px) 60vw, 70vw" className={styles.heroImage} />
        <div className={styles.stageShade} />
        <div className={styles.stageTop}><span>{sceneNames[config.sceneId]}<small>{viewNames[config.viewId]} · PRE-RENDERED PHOTOGRAPHY</small></span><b>NO WEBGL</b></div>
        <div className={styles.plate}>{config.plateText}</div>
        <div className={styles.viewBar}><span>VIEW</span>{views.map((view) => <button key={view} className={config.viewId === view ? styles.active : ''} onClick={() => choose(canonical({ sceneId: 'sunset', viewId: view }), view === 'three-quarter' ? undefined : 'VIEW RENDER LOADED · CUSTOM OPTIONS RESET TO VERIFIED SET')}>{viewNames[view]}</button>)}</div>
      </section>

      <aside className={styles.configurator}>
        <div className={styles.configHead}><span className={styles.eyebrow}>02 / CONFIGURE</span><h2>CUSTOMIZE<br />YOUR RIDE</h2></div>
        <nav className={styles.tabs}>{(['paint', 'wheels', 'livery', 'details', 'scene'] as Tab[]).map((item) => <button key={item} className={tab === item ? styles.active : ''} onClick={() => setTab(item)}>{item}</button>)}</nav>
        <div className={styles.controls}>
          {tab === 'paint' && <><ControlTitle title="PAINT FINISH" note="Verified studio renders" /><div className={styles.paintGrid}>
            <Option selected={config.paintColor === 'silver'} onClick={() => choose(canonical({ paintColor: 'silver' }))}><i style={{ background: 'linear-gradient(135deg,#fff,#7a8589)' }} /><b>SILVER ALLOY</b><small>Metallic</small></Option>
            <Option selected={config.paintColor === 'racing-orange'} onClick={() => choose(canonical({ paintColor: 'racing-orange' }))}><i style={{ background: '#d94412' }} /><b>RACING ORANGE</b><small>Metallic</small></Option>
          </div><Unavailable label="Petrol Teal and Midnight Black" /></>}
          {tab === 'wheels' && <><ControlTitle title="WHEEL DESIGN" note="Full image replacement" /><div className={styles.optionCards}>{(['classic', 'mesh', 'aero'] as const).map((wheel) => <button key={wheel} className={config.wheelId === wheel ? styles.selected : ''} onClick={() => choose(canonical({ wheelId: wheel }))}><span><Image src={`/assets/garage-2d/wheels/${wheel}.webp`} alt={`${wheel} wheel preview`} fill sizes="110px" /></span><b>{wheel}</b>{config.wheelId === wheel && <Check size={13} />}</button>)}</div><p className={styles.helper}>Wheel color is baked into each verified photograph; unsupported free tinting is intentionally disabled.</p></>}
          {tab === 'livery' && <><ControlTitle title="LIVERY" note="Matched photography" /><div className={styles.liveryCards}><button className={config.liveryId === 'stripes-77' ? styles.selected : ''} onClick={() => choose(canonical({ liveryId: 'stripes-77', decalId: 'number-77' }))}><Image src="/assets/garage-2d/decals/stripes-77.webp" alt="Orange stripe and number 77 livery" fill sizes="140px" /><span>STRIPE + 77</span></button><button className={config.liveryId === 'clean' ? styles.selected : ''} onClick={() => choose(canonical({ liveryId: 'clean', decalId: 'none' }))}><Image src="/assets/garage-2d/decals/clean.webp" alt="Clean silver body without livery" fill sizes="140px" /><span>CLEAN BODY</span></button></div><Unavailable label="Custom number rendering" /></>}
          {tab === 'details' && <><ControlTitle title="ROAD DETAILS" note="Live 2D overlay" /><label className={styles.field}>LICENSE PLATE<input aria-label="License plate" maxLength={8} value={config.plateText} onChange={(event) => replace({ ...config, plateText: event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '') || 'NEON77' })} /></label><div className={styles.platePreview}>{config.plateText}</div><p className={styles.helper}>The plate overlay is drawn into the exported capture, not added as a fixed sample.</p></>}
          {tab === 'scene' && <><ControlTitle title="ENVIRONMENT" note="Independent full renders" /><div className={styles.sceneGrid}>{(Object.keys(sceneNames) as GarageConfig['sceneId'][]).map((scene) => <button key={scene} className={config.sceneId === scene ? styles.selected : ''} onClick={() => choose(canonical({ sceneId: scene }))}><Image src={scene === 'night' ? assets.night : scene === 'paddock' ? assets.paddock : scene === 'studio' ? assets.studio : assets.default} alt={sceneNames[scene]} fill sizes="150px" /><span>{sceneNames[scene]}</span></button>)}</div><p className={styles.helper}>Scene renders use the supported silver, classic-wheel, striped three-quarter configuration.</p></>}
        </div>
      </aside>
    </div>
    <footer className={styles.toolbar}>
      <div className={styles.history}><button disabled={!past.length} onClick={undo}><Undo2 size={15} />UNDO</button><button disabled={!future.length} onClick={redo}><Redo2 size={15} />REDO</button><button onClick={() => { reset(); flash('DEFAULT BUILD RESTORED'); }}><RotateCcw size={15} />RESET</button></div>
      <div className={styles.actions}><button className={styles.save} disabled={busy === 'save'} onClick={save}><Save size={15} />{busy === 'save' ? 'SAVING…' : 'SAVE DRAFT'}</button><button onClick={restoreDraft}><Upload size={15} />RESTORE</button><button disabled={busy === 'capture'} onClick={capture}><Camera size={15} />CAPTURE</button><button onClick={share}><Share2 size={15} />SHARE</button><button onClick={mint} title={!isConnected ? 'Connect wallet required' : !contractReady ? 'NFT contract not deployed' : 'Open mint flow'}><Coins size={15} />MINT NFT</button></div>
      {message && <div role="status" className={styles.toast}>{message}</div>}
    </footer>
  </main>;
}

function ControlTitle({ title, note }: { title: string; note: string }) { return <div className={styles.controlTitle}><b>{title}</b><span>{note}</span></div>; }
function Option({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) { return <button className={selected ? styles.selected : ''} onClick={onClick}>{children}</button>; }
function Unavailable({ label }: { label: string }) { return <div className={styles.unavailable}><Download size={13} /><span><b>{label}</b>IMAGE ASSET REQUIRED</span></div>; }
