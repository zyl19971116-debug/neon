// @ts-nocheck -- Archived WebGL implementation retained for reference; /garage no longer imports this module.
'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, OrbitControls, useGLTF } from '@react-three/drei';
import { Component, ReactNode, Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useGarage } from '@/store/garage';

type Props = { lowPerformance?: boolean; onReady?: () => void; onError?: (message: string) => void };
const palettes = {
  sunset: { sky: '#df7040', floor: '#3d2820', key: '#ffb06d', fill: '#ffe4b7', sign: '#ff5b20' },
  studio: { sky: '#d7d0c5', floor: '#77716a', key: '#fff4e5', fill: '#d8e2df', sign: '#ff5b20' },
  night: { sky: '#061416', floor: '#0a1e20', key: '#f7652b', fill: '#70b9ad', sign: '#ff6b32' },
  paddock: { sky: '#8d9187', floor: '#414841', key: '#f7d4a0', fill: '#c6d0c7', sign: '#f25a24' },
} as const;

function usePlateTexture(text: string) {
  return useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 160;
    const ctx = canvas.getContext('2d');
    if (ctx) { ctx.fillStyle = '#f2e6cf'; ctx.fillRect(0, 0, 512, 160); ctx.strokeStyle = '#0a1c1e'; ctx.lineWidth = 12; ctx.strokeRect(8, 8, 496, 144); ctx.fillStyle = '#0a1c1e'; ctx.font = '900 72px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 256, 84); }
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
  }, [text]);
}

function Wheel({ x, z }: { x: number; z: number }) {
  const { wheelId, wheelColor } = useGarage((state) => state.config);
  const spokes = wheelId === 'classic' ? 5 : wheelId === 'mesh' ? 10 : 3;
  return <group position={[x, -0.18, z]} rotation={[Math.PI / 2, 0, 0]}>
    <mesh castShadow><torusGeometry args={[0.42, 0.15, 12, 32]} /><meshStandardMaterial color="#0b0c0b" roughness={0.78} /></mesh>
    <mesh><cylinderGeometry args={[0.3, 0.3, 0.18, wheelId === 'aero' ? 6 : 24]} /><meshStandardMaterial color={wheelColor} metalness={0.88} roughness={0.2} /></mesh>
    {Array.from({ length: spokes }, (_, index) => <mesh key={index} rotation={[0, 0, (Math.PI * 2 * index) / spokes]} position={[0.14, 0, 0]}><boxGeometry args={[0.3, 0.055, 0.2]} /><meshStandardMaterial color={wheelColor} metalness={0.9} roughness={0.16} /></mesh>)}
  </group>;
}

function ProceduralCar() {
  const c = useGarage((state) => state.config); const plate = usePlateTexture(c.licensePlate);
  useEffect(() => () => plate.dispose(), [plate]);
  const finish = c.paintColor === '#171717' ? { metalness: 0.15, roughness: 0.72 } : { metalness: 0.82, roughness: 0.2 };
  return <group rotation={[0, -0.42, 0]} scale={1.08} position={[0, 0.05, 0]}>
    <mesh castShadow position={[0, 0.15, 0]} scale={[2.25, 0.48, 1]}><boxGeometry /><meshStandardMaterial color={c.paintColor} {...finish} /></mesh>
    <mesh castShadow position={[-0.18, 0.78, 0]} scale={[1.12, 0.62, 0.86]}><boxGeometry /><meshPhysicalMaterial color="#173236" metalness={0.45} roughness={0.12} transmission={0.12} /></mesh>
    <mesh castShadow position={[2.05, 0.38, 0]} scale={[0.35, 0.22, 0.96]}><boxGeometry /><meshStandardMaterial color={c.paintColor} {...finish} /></mesh>
    <mesh castShadow position={[-2.05, 0.34, 0]} scale={[0.3, 0.2, 0.95]}><boxGeometry /><meshStandardMaterial color={c.paintColor} {...finish} /></mesh>
    {c.stripes && <mesh position={[0.1, 0.641, 0]} scale={[1.78, 0.035, 0.13]}><boxGeometry /><meshStandardMaterial color="#f5ebdd" roughness={0.48} /></mesh>}
    {c.decals.length > 0 && <><mesh position={[0.62, 0.18, 1.012]} scale={[0.34, 0.34, 0.025]}><circleGeometry args={[1, 32]} /><meshStandardMaterial color="#f5ebdd" /></mesh><mesh position={[0.62, 0.18, -1.012]} rotation={[0, Math.PI, 0]} scale={[0.34, 0.34, 0.025]}><circleGeometry args={[1, 32]} /><meshStandardMaterial color="#f5ebdd" /></mesh></>}
    <mesh position={[2.236, 0.1, 0]} rotation={[0, Math.PI / 2, 0]} scale={[0.56, 0.18, 1]}><planeGeometry /><meshBasicMaterial map={plate} toneMapped={false} /></mesh>
    <mesh position={[2.37, 0.38, 0.58]} rotation={[0, Math.PI / 2, 0]}><circleGeometry args={[0.17, 24]} /><meshStandardMaterial color="#ffe0a0" emissive="#ffb13b" emissiveIntensity={2} /></mesh>
    <mesh position={[2.37, 0.38, -0.58]} rotation={[0, Math.PI / 2, 0]}><circleGeometry args={[0.17, 24]} /><meshStandardMaterial color="#ffe0a0" emissive="#ffb13b" emissiveIntensity={2} /></mesh>
    <Wheel x={-1.35} z={0.84} /><Wheel x={1.35} z={0.84} /><Wheel x={-1.35} z={-0.84} /><Wheel x={1.35} z={-0.84} />
  </group>;
}

function useNumberTexture(number: string) {
  return useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) { ctx.clearRect(0, 0, 512, 512); ctx.fillStyle = '#f2e6cf'; ctx.beginPath(); ctx.arc(256, 256, 230, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#10191a'; ctx.lineWidth = 18; ctx.stroke(); ctx.fillStyle = '#10191a'; ctx.font = '900 250px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(number || '77', 256, 275); }
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
  }, [number]);
}

function LoadedWheel({ url, position, flip, color }: { url: string; position: [number, number, number]; flip: boolean; color: string }) {
  const gltf = useGLTF(url);
  const wheel = useMemo(() => {
    const clone = gltf.scene.clone(true);
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true; child.receiveShadow = true;
      const wasArray = Array.isArray(child.material); const materials: THREE.Material[] = wasArray ? child.material : [child.material];
      const mapped = materials.map((source: THREE.Material) => { const material = source.clone() as THREE.MeshStandardMaterial; if (material.name === 'NG_ALLOY') material.color.set(color); return material; });
      child.material = wasArray ? mapped : mapped[0];
    });
    return clone;
  }, [color, gltf.scene]);
  return <primitive object={wheel} position={position} scale={[1, flip ? -1 : 1, 1]} />;
}

function LoadedCar() {
  const c = useGarage((state) => state.config);
  const gltf = useGLTF('/models/cars/ng-classic-77.glb');
  const number = c.decals.find((item) => /^\d{1,3}$/.test(item)) || '77';
  const numberTexture = useNumberTexture(number);
  const showRoundel = c.decals.some((item) => /^\d{1,3}$/.test(item));
  const showSpoiler = !c.decals.includes('spoiler:hidden');
  const car = useMemo(() => {
    const clone = gltf.scene.clone(true);
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true; child.receiveShadow = true;
      if (child.name.startsWith('WHEEL_') || child.name === 'DECAL_LEFT' || child.name === 'DECAL_RIGHT') child.visible = false;
      if (child.name === 'DECAL_HOOD') child.visible = c.stripes;
      if (child.name === 'SPOILER') child.visible = showSpoiler;
      const wasArray = Array.isArray(child.material); const materials: THREE.Material[] = wasArray ? child.material : [child.material];
      const mapped = materials.map((source: THREE.Material) => {
        const material = source.clone() as THREE.MeshStandardMaterial;
        if (child.name === 'BODY_PAINT' || material.name === 'NG_SILVER_METALLIC') {
          material.color.set(c.paintColor); material.metalness = c.paintColor === '#171717' ? .18 : .78; material.roughness = c.paintColor === '#171717' ? .68 : .2;
        }
        return material;
      }); child.material = wasArray ? mapped : mapped[0];
    });
    return clone;
  }, [c.paintColor, c.stripes, gltf.scene, showSpoiler]);
  useEffect(() => () => numberTexture.dispose(), [numberTexture]);
  const wheelUrl = `/models/cars/wheel-${c.wheelId}.glb`;
  return <group rotation={[0, -0.42, 0]} scale={1.08} position={[0, -0.62, 0]}>
    <primitive object={car} />
    <LoadedWheel url={wheelUrl} position={[1.55, .42, .99]} flip color={c.wheelColor} /><LoadedWheel url={wheelUrl} position={[1.55, .42, -.99]} flip={false} color={c.wheelColor} />
    <LoadedWheel url={wheelUrl} position={[-1.55, .42, .99]} flip color={c.wheelColor} /><LoadedWheel url={wheelUrl} position={[-1.55, .42, -.99]} flip={false} color={c.wheelColor} />
    {showRoundel && <><mesh position={[-.18, .56, 1.108]}><circleGeometry args={[.34, 48]} /><meshBasicMaterial map={numberTexture} transparent toneMapped={false} /></mesh><mesh position={[-.18, .56, -1.108]} rotation={[0, Math.PI, 0]}><circleGeometry args={[.34, 48]} /><meshBasicMaterial map={numberTexture} transparent toneMapped={false} /></mesh></>}
  </group>;
}

class ModelBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <ProceduralCar /> : this.props.children; }
}

function Car() { return <ModelBoundary><Suspense fallback={<ProceduralCar />}><LoadedCar /></Suspense></ModelBoundary>; }

useGLTF.preload('/models/cars/ng-classic-77.glb');
useGLTF.preload('/models/cars/wheel-classic.glb');
useGLTF.preload('/models/cars/wheel-mesh.glb');
useGLTF.preload('/models/cars/wheel-aero.glb');

function GarageSet() {
  const env = useGarage((state) => state.config.environment); const p = palettes[env];
  return <><color attach="background" args={[p.sky]} /><fog attach="fog" args={[p.sky, 10, 24]} /><hemisphereLight args={[p.fill, '#17110c', env === 'night' ? 0.9 : 1.8]} /><directionalLight position={[5, 8, 6]} intensity={env === 'night' ? 2.2 : 3.8} color={p.key} castShadow shadow-mapSize={[1024, 1024]} /><pointLight position={[-4, 2.5, -2]} intensity={env === 'night' ? 18 : 8} color={p.sign} distance={9} /><mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 0]}><planeGeometry args={[30, 30]} /><meshStandardMaterial color={p.floor} roughness={0.64} metalness={0.15} /></mesh><mesh receiveShadow position={[0, -0.62, 0]}><cylinderGeometry args={[3.8, 4, 0.2, 64]} /><meshStandardMaterial color="#11282a" roughness={0.45} metalness={0.42} /></mesh><gridHelper args={[30, 30, p.sign, '#203436']} position={[0, -0.605, 0]} /><mesh position={[0, 3.6, -5.5]}><planeGeometry args={[15, 8]} /><meshStandardMaterial color={env === 'night' ? '#07191b' : '#3c312b'} roughness={0.9} /></mesh><mesh position={[0, 3.8, -5.35]}><boxGeometry args={[5.3, 0.12, 0.12]} /><meshStandardMaterial color={p.sign} emissive={p.sign} emissiveIntensity={3} /></mesh></>;
}

function CameraRig({ onReady }: { onReady?: () => void }) {
  const preset = useGarage((state) => state.config.cameraPreset); const { camera, invalidate } = useThree(); const controls = useRef<OrbitControlsImpl>(null); const announced = useRef(false);
  useFrame(() => { if (!announced.current) { announced.current = true; onReady?.(); } });
  useEffect(() => { const positions = { free: [5.8, 3.1, 6.7], front: [7.5, 1.8, 0], back: [-7.5, 1.8, 0], left: [0, 1.8, 7.5], right: [0, 1.8, -7.5] } as const; const position = positions[preset]; camera.position.set(position[0], position[1], position[2]); controls.current?.target.set(0, 0.25, 0); controls.current?.update(); invalidate(); }, [camera, preset, invalidate]);
  return <OrbitControls ref={controls} makeDefault enablePan={false} minDistance={5} maxDistance={10} minPolarAngle={0.65} maxPolarAngle={1.48} dampingFactor={0.08} enableDamping />;
}

export function GarageCanvas({ lowPerformance = false, onReady, onError }: Props) {
  return <Canvas data-testid="garage-canvas-host" frameloop="demand" dpr={lowPerformance ? 1 : [1, 1.5]} camera={{ position: [5.8, 3.1, 6.7], fov: 38, near: 0.1, far: 40 }} gl={{ preserveDrawingBuffer: true, antialias: !lowPerformance, powerPreference: lowPerformance ? 'low-power' : 'high-performance', alpha: false }} shadows={!lowPerformance} onCreated={({ gl }) => { gl.domElement.id = 'garage-canvas'; gl.domElement.dataset.testid = 'garage-canvas'; gl.outputColorSpace = THREE.SRGBColorSpace; gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.08; gl.domElement.addEventListener('webglcontextlost', (event) => { event.preventDefault(); onError?.('WebGL context was lost.'); }, { once: true }); }}><GarageSet /><Car />{!lowPerformance && <ContactShadows position={[0, -0.7, 0]} opacity={0.58} scale={10} blur={2.5} far={5} />}<CameraRig onReady={onReady} /></Canvas>;
}
