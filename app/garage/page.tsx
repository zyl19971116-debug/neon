'use client';

import dynamic from 'next/dynamic';
import { Component, ReactNode, useEffect, useRef, useState } from 'react';
import { Camera, Check, ChevronRight, Coins, Gauge, Plus, Redo2, RotateCcw, Save, Share2, Undo2 } from 'lucide-react';
import { garageConfigSchema, useGarage } from '@/store/garage';
import styles from './garage.module.css';

const Canvas3D = dynamic(() => import('@/components/GarageCanvas').then((module) => module.GarageCanvas), { ssr: false });
type Tab = 'paint' | 'wheels' | 'livery' | 'details' | 'scene';
type Stage = 'loading' | 'ready' | 'error' | 'unsupported';

class CanvasBoundary extends Component<{ children: ReactNode; onError: (message: string) => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { this.props.onError(error.message); }
  render() { return this.state.failed ? null : this.props.children; }
}

function supportsWebGL() {
  try { const canvas = document.createElement('canvas'); return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl'))); } catch { return false; }
}

function CarPreview({ color = '#ff5b20' }: { color?: string }) {
  return <div className={styles.carPreview} style={{ '--car': color } as React.CSSProperties}><span className={styles.previewRoof} /><span className={styles.previewBody} /><i /><i /></div>;
}

function Viewport({ lowPerformance, onStatus }: { lowPerformance: boolean; onStatus: (stage: Stage) => void }) {
  const [attempt, setAttempt] = useState(0); const [stage, setStage] = useState<Stage>('loading'); const timer = useRef<ReturnType<typeof setTimeout>>();
  const fail = () => { clearTimeout(timer.current); setStage('error'); onStatus('error'); };
  const ready = () => { clearTimeout(timer.current); setStage('ready'); onStatus('ready'); };
  useEffect(() => {
    if (!supportsWebGL()) { setStage('unsupported'); onStatus('unsupported'); return; }
    setStage('loading'); onStatus('loading');
    if (new URLSearchParams(window.location.search).get('simulate3dError') === '1' && attempt === 0) { timer.current = setTimeout(fail, 300); return () => clearTimeout(timer.current); }
    timer.current = setTimeout(fail, 10000); return () => clearTimeout(timer.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);
  const retry = () => setAttempt((value) => value + 1);
  return <div className={styles.viewport} data-render-state={stage}>
    {(stage === 'loading' || stage === 'ready') && <CanvasBoundary key={attempt} onError={fail}><Canvas3D lowPerformance={lowPerformance} onReady={ready} onError={fail} /></CanvasBoundary>}
    {stage === 'loading' && <div className={styles.loading}><div className={styles.loader} /><b>PREPARING SHOW FLOOR</b><span>Loading local geometry &amp; materials</span></div>}
    {(stage === 'error' || stage === 'unsupported') && <div className={styles.fallback}><CarPreview /><b>{stage === 'unsupported' ? 'WEBGL IS NOT AVAILABLE' : '3D SCENE COULD NOT START'}</b><span>A static vehicle preview is active. Your configuration is safe.</span>{stage === 'error' && <button onClick={retry}>RETRY 3D <ChevronRight size={14} /></button>}</div>}
  </div>;
}

const paintOptions = [{ name: 'Racing Orange', value: '#ff5b20', finish: 'Metallic' }, { name: 'Cream', value: '#f5ebdd', finish: 'Metallic' }, { name: 'Petrol Teal', value: '#0ea5a4', finish: 'Metallic' }, { name: 'Midnight', value: '#171717', finish: 'Matte' }, { name: 'Heritage Red', value: '#8b1e14', finish: 'Metallic' }];
const scenes = { sunset: ['SUNSET', 'Warm dusk'], studio: ['STUDIO', 'Soft neutral'], night: ['NIGHT', 'Street glow'], paddock: ['PADDOCK', 'Track day'] } as const;

export default function Garage() {
  const { config, set, reset, undo, redo, restore, past, future } = useGarage();
  const [tab, setTab] = useState<Tab>('paint'); const [stage, setStage] = useState<Stage>('loading'); const [lowPerformance, setLowPerformance] = useState(false); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(''); const messageTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => { const raw = localStorage.getItem('neon-garage-draft'); if (!raw) return; try { if (restore(JSON.parse(raw))) flash('SAVED BUILD RESTORED'); } catch { flash('SAVED BUILD COULD NOT BE READ'); } }, [restore]);
  useEffect(() => () => clearTimeout(messageTimer.current), []);
  const flash = (text: string) => { clearTimeout(messageTimer.current); setMessage(text); messageTimer.current = setTimeout(() => setMessage(''), 2600); };
  const save = () => { setBusy('save'); const result = garageConfigSchema.safeParse(config); if (!result.success) { setBusy(''); flash('SAVE ERROR — INVALID CONFIGURATION'); return; } localStorage.setItem('neon-garage-draft', JSON.stringify(result.data)); setTimeout(() => { setBusy(''); flash('BUILD SAVED LOCALLY'); }, 250); };
  const capture = () => { const canvas = document.querySelector('canvas#garage-canvas') as HTMLCanvasElement | null; if (!canvas || stage !== 'ready') return flash('CAPTURE UNAVAILABLE — 3D IS NOT READY'); try { const link = document.createElement('a'); link.download = `neon-garage-${Date.now()}.png`; link.href = canvas.toDataURL('image/png'); link.click(); flash('CURRENT SCENE CAPTURED'); } catch { flash('CAPTURE FAILED'); } };
  const share = async () => { if (!localStorage.getItem('neon-garage-draft')) return flash('SAVE BUILD BEFORE SHARING'); try { await navigator.clipboard.writeText(`${location.origin}/garage`); flash('GARAGE LINK COPIED'); } catch { flash('SHARE REQUIRES CLIPBOARD ACCESS'); } };
  return <main className={styles.page} data-config={JSON.stringify(config)}>
    <header className={styles.workHeader}><div><span>NEON GARAGE / CONFIGURATOR</span><h1>CUSTOM BUILD STUDIO</h1></div><div className={styles.status}><i className={stage === 'ready' ? styles.online : ''} />{stage === 'ready' ? '3D READY' : stage.toUpperCase()}</div></header>
    <div className={styles.studio}>
      <aside className={styles.garageRail}>
        <div><span className={styles.eyebrow}>01 / COLLECTION</span><h2>MY GARAGE</h2></div>
        <button className={styles.vehicleCard}><div className={styles.thumb}><CarPreview color={config.paintColor} /><span className={styles.liveBadge}>{stage === 'ready' ? 'LIVE' : stage.toUpperCase()}</span></div><b>NG CLASSIC 77</b><small>RESTOMOD COUPÉ · 1977</small><em>ACTIVE BUILD <ChevronRight size={13} /></em></button>
        <button className={styles.addVehicle}><Plus size={17} /><span><b>ADD VEHICLE</b><small>New base model</small></span></button>
        <div className={styles.railFoot}><span>MODEL SOURCE</span><b>PROCEDURAL FALLBACK</b><small>Licensed GLTF not supplied</small></div>
      </aside>
      <section className={styles.stage}>
        <Viewport lowPerformance={lowPerformance} onStatus={setStage} />
        <div className={styles.stageTop}><span>SUNSET GARAGE <small>DEFAULT ENVIRONMENT</small></span><button aria-pressed={lowPerformance} onClick={() => setLowPerformance((value) => !value)}><Gauge size={14} />LOW PERFORMANCE {lowPerformance ? 'ON' : 'OFF'}</button></div>
        <div className={styles.cameraBar}><span>VIEW</span>{(['free', 'front', 'back', 'left', 'right'] as const).map((view) => <button key={view} className={config.cameraPreset === view ? styles.active : ''} onClick={() => set('cameraPreset', view)}>{view}</button>)}</div>
        <div className={styles.gestureHint}>DRAG TO ROTATE&nbsp;&nbsp;·&nbsp;&nbsp;SCROLL TO ZOOM</div>
      </section>
      <aside className={styles.configurator}>
        <div className={styles.configHead}><span className={styles.eyebrow}>02 / CONFIGURE</span><h2>CUSTOMIZE<br />YOUR RIDE</h2></div>
        <nav className={styles.tabs}>{(['paint', 'wheels', 'livery', 'details', 'scene'] as Tab[]).map((item) => <button key={item} className={tab === item ? styles.active : ''} onClick={() => setTab(item)}>{item}</button>)}</nav>
        <div className={styles.controls}>
          {tab === 'paint' && <><ControlTitle title="BODY FINISH" note="Real-time material" /><div className={styles.swatches}>{paintOptions.map((paint) => <button key={paint.value} aria-label={paint.name} className={config.paintColor === paint.value ? styles.selected : ''} onClick={() => set('paintColor', paint.value)}><i style={{ background: paint.value }} /><span>{paint.name}<small>{paint.finish}</small></span>{config.paintColor === paint.value && <Check size={15} />}</button>)}</div></>}
          {tab === 'wheels' && <><ControlTitle title="WHEEL DESIGN" note="Geometry swap" /><div className={styles.wheels}>{(['classic', 'mesh', 'aero'] as const).map((wheel) => <button key={wheel} className={config.wheelId === wheel ? styles.selected : ''} onClick={() => set('wheelId', wheel)}><span className={`${styles.wheelArt} ${styles[wheel]}`} /> <b>{wheel}</b></button>)}</div><ControlTitle title="WHEEL FINISH" note="Metal color" /><label className={styles.colorInput}><input aria-label="Wheel color" value={config.wheelColor} onChange={(event) => set('wheelColor', event.target.value)} type="color" /><span>{config.wheelColor.toUpperCase()}</span></label></>}
          {tab === 'livery' && <><ControlTitle title="RACING GRAPHICS" note="Live 3D decals" /><Toggle label="RACING STRIPES" checked={config.stripes} onChange={(value) => set('stripes', value)} /><Toggle label="NUMBER ROUNDEL" checked={config.decals.length > 0} onChange={(value) => set('decals', value ? ['77'] : [])} /><label className={styles.field}>RACE NUMBER<input value={config.decals[0] || ''} maxLength={3} disabled={!config.decals.length} onChange={(event) => set('decals', event.target.value.replace(/\D/g, '') ? [event.target.value.replace(/\D/g, '')] : [])} /></label></>}
          {tab === 'details' && <><ControlTitle title="ROAD DETAILS" note="Saved with build" /><label className={styles.field}>LICENSE PLATE<input aria-label="License plate" maxLength={8} value={config.licensePlate} onChange={(event) => set('licensePlate', event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''))} /></label><div className={styles.platePreview}>{config.licensePlate || '—'}</div><p className={styles.helper}>Changes are rendered directly into a local CanvasTexture—no remote font request.</p></>}
          {tab === 'scene' && <><ControlTitle title="ENVIRONMENT" note="Canvas stays mounted" /><div className={styles.scenes}>{(Object.keys(scenes) as (keyof typeof scenes)[]).map((scene) => <button key={scene} data-scene={scene} className={config.environment === scene ? styles.selected : ''} onClick={() => set('environment', scene)}><i /><b>{scenes[scene][0]}</b><small>{scenes[scene][1]}</small></button>)}</div></>}
        </div>
      </aside>
    </div>
    <footer className={styles.toolbar}>
      <div className={styles.history}><button disabled={!past.length} onClick={undo}><Undo2 size={15} />UNDO</button><button disabled={!future.length} onClick={redo}><Redo2 size={15} />REDO</button><button onClick={() => { reset(); flash('FACTORY CONFIGURATION RESTORED'); }}><RotateCcw size={15} />RESET</button></div>
      <div className={styles.actions}><button className={styles.save} disabled={busy === 'save'} onClick={save}><Save size={15} />{busy === 'save' ? 'SAVING…' : 'SAVE BUILD'}</button><button onClick={capture} disabled={stage !== 'ready'}><Camera size={15} />CAPTURE</button><button onClick={share}><Share2 size={15} />SHARE</button><button onClick={() => flash('MINT REQUIRES A CONNECTED WALLET AND DEPLOYED CONTRACT')} title="Requires connected wallet and deployed contract"><Coins size={15} />MINT NFT</button></div>
      {message && <div role="status" className={styles.toast}>{message}</div>}
    </footer>
  </main>;
}

function ControlTitle({ title, note }: { title: string; note: string }) { return <div className={styles.controlTitle}><b>{title}</b><span>{note}</span></div>; }
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className={styles.toggle}><span>{label}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><i /></label>; }
