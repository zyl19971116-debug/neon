'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Camera, Coins, Plus, Redo2, RotateCcw, Save, Share2, Shuffle, Undo2, Upload } from 'lucide-react';
import { useAccount } from 'wagmi';
import { CarLayerRenderer } from '@/components/garage/CarLayerRenderer';
import { CustomizationPanel } from '@/components/garage/CustomizationPanel';
import { canonicalConfig, randomSupportedConfig } from '@/lib/garage/asset-manifest';
import { GarageConfig, garageConfigSchema } from '@/lib/garage/configuration-schema';
import { useGarage } from '@/store/garage';
import styles from './garage.module.css';

const draftKey = 'neon-garage-2d-v2-draft';
const views: GarageConfig['viewId'][] = ['front', 'side', 'rear', 'three-quarter'];
const viewNames = { front: 'FRONT', side: 'SIDE', rear: 'REAR', 'three-quarter': 'THREE QUARTER' } as const;

export default function Garage() {
  const { config, replace, reset, restore, undo, redo, past, future } = useGarage();
  const { isConnected } = useAccount();
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState('');
  const imageRef = useRef<HTMLImageElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const contractReady = Boolean(process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS);
  const flash = (text: string) => { clearTimeout(timer.current); setMessage(text); timer.current = setTimeout(() => setMessage(''), 2800); };

  useEffect(() => {
    const encoded = new URLSearchParams(location.search).get('build');
    if (encoded) { try { restore(JSON.parse(atob(decodeURIComponent(encoded)))); } catch { flash('SHARED BUILD IS INVALID'); } }
    return () => clearTimeout(timer.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const choose = (next: GarageConfig, note?: string) => { replace(next); if (note) flash(note); };
  const save = () => {
    setBusy('save'); const parsed = garageConfigSchema.safeParse(config);
    if (!parsed.success) { setBusy(''); return flash('BUILD INVALID — NOT SAVED'); }
    localStorage.setItem(draftKey, JSON.stringify(parsed.data));
    setTimeout(() => { setBusy(''); flash('COMPLETE V2 BUILD SAVED'); }, 220);
  };
  const load = () => {
    const raw = localStorage.getItem(draftKey);
    if (!raw) return flash('NO V2 BUILD FOUND');
    try { flash(restore(JSON.parse(raw)) ? 'BUILD LOADED' : 'BUILD IS NOT COMPATIBLE'); } catch { flash('BUILD COULD NOT BE READ'); }
  };
  const capture = () => {
    const image = imageRef.current;
    if (!image?.complete || !image.naturalWidth) return flash('IMAGE IS STILL LOADING');
    setBusy('capture');
    try {
      const canvas = document.createElement('canvas'); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d'); if (!context) throw new Error();
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      if (config.liveryId === 'number-77' && config.raceNumber !== 77 && config.viewId === 'three-quarter') {
        context.fillStyle = '#f5ebdd'; context.beginPath(); context.arc(canvas.width * .292, canvas.height * .54, canvas.height * .09, 0, Math.PI * 2); context.fill();
        context.strokeStyle = '#081b1d'; context.lineWidth = 5; context.stroke();
        context.fillStyle = '#081b1d'; context.font = `900 ${Math.round(canvas.height * .085)}px Arial`; context.textAlign = 'center'; context.fillText(String(config.raceNumber), canvas.width * .292, canvas.height * .57);
      }
      context.fillStyle = '#f5ebdd'; context.strokeStyle = '#081b1d'; context.lineWidth = 5;
      context.fillRect(canvas.width * .76, canvas.height * .82, canvas.width * .15, canvas.height * .065); context.strokeRect(canvas.width * .76, canvas.height * .82, canvas.width * .15, canvas.height * .065);
      context.fillStyle = '#081b1d'; context.font = `900 ${Math.round(canvas.height * .035)}px Arial`; context.textAlign = 'center'; context.fillText(config.plateText, canvas.width * .835, canvas.height * .865);
      const link = document.createElement('a'); link.download = `ng-classic-77-v2-${Date.now()}.png`; link.href = canvas.toDataURL('image/png'); link.click(); flash('CURRENT COMPOSITION EXPORTED');
    } catch { flash('CAPTURE FAILED'); } finally { setBusy(''); }
  };
  const share = async () => {
    const url = `${location.origin}/garage?build=${encodeURIComponent(btoa(JSON.stringify(config)))}`;
    try { if (navigator.share) await navigator.share({ title: 'NG CLASSIC 77 V2', url }); else await navigator.clipboard.writeText(url); flash('CONFIGURATION LINK READY'); } catch { flash('SHARE CANCELLED OR UNAVAILABLE'); }
  };
  const mint = () => { if (!isConnected) return flash('CONNECT A WALLET BEFORE MINTING'); if (!contractReady) return flash('NFT CONTRACT IS NOT DEPLOYED'); flash('USE THE EXISTING CONTRACT FLOW TO CONTINUE'); };

  return <main className={styles.page} data-config={JSON.stringify(config)}>
    <header className={styles.workHeader}><div><span>NEON GARAGE / 2D CUSTOMIZATION V2</span><h1>BUILD YOUR ICON</h1></div><div className={styles.assetStatus}><i />ASSET PACK <b>GARAGE-2D-V2</b></div></header>
    <div className={styles.studio}>
      <aside className={styles.garageRail}>
        <div><span className={styles.eyebrow}>01 / COLLECTION</span><h2>MY GARAGE</h2></div>
        <button className={styles.vehicleCard} aria-pressed="true"><div className={styles.thumb}><Image src="/assets/garage-2d/previews/ng77-thumb.webp" alt="NG Classic 77 thumbnail" fill sizes="220px" /><span>ACTIVE</span></div><b>NG CLASSIC 77</b><small>1970s WIDEBODY RACING COUPÉ</small><em>V2 ASSET PACK</em></button>
        <button className={styles.addVehicle} disabled><Plus size={18} /><span><b>ADD VEHICLE</b><small>Asset pack required</small></span></button>
        <div className={styles.railNote}><b>VERIFIED IMAGE MODE</b><p>Each enabled option has a distinct render. Locked choices are never simulated.</p></div>
      </aside>
      <section className={styles.stage}>
        <CarLayerRenderer config={config} imageRef={imageRef} />
        <div className={styles.stageTop}><span>NG CLASSIC 77<small>{config.sceneId.toUpperCase()} · {viewNames[config.viewId]} · PRE-RENDERED</small></span><b>NO WEBGL</b></div>
        <div className={styles.viewBar}><span>VIEW</span>{views.map((view) => <button key={view} className={config.viewId === view ? styles.active : ''} onClick={() => choose(canonicalConfig({ sceneId: 'sunset', viewId: view }), 'VIEW RENDER LOADED · BUILD RESET TO VERIFIED VIEW')}>{viewNames[view]}</button>)}</div>
      </section>
      <CustomizationPanel config={config} onChoose={choose} />
    </div>
    <footer className={styles.toolbar}>
      <div className={styles.history}><button disabled={!past.length} onClick={undo}><Undo2 size={15} />UNDO</button><button disabled={!future.length} onClick={redo}><Redo2 size={15} />REDO</button><button onClick={() => { reset(); flash('DEFAULT BUILD RESTORED'); }}><RotateCcw size={15} />RESET</button><button onClick={() => choose(randomSupportedConfig(), 'RANDOM VERIFIED BUILD CREATED')}><Shuffle size={15} />RANDOM</button></div>
      <div className={styles.actions}><button className={styles.save} disabled={busy === 'save'} onClick={save}><Save size={15} />{busy === 'save' ? 'SAVING…' : 'SAVE BUILD'}</button><button onClick={load}><Upload size={15} />LOAD BUILD</button><button disabled={busy === 'capture'} onClick={capture}><Camera size={15} />CAPTURE</button><button onClick={share}><Share2 size={15} />SHARE</button><button onClick={mint} title={!isConnected ? 'Connect wallet required' : !contractReady ? 'NFT contract not deployed' : 'Open mint flow'}><Coins size={15} />MINT NFT</button></div>
      {message && <div role="status" className={styles.toast}>{message}</div>}
    </footer>
  </main>;
}
