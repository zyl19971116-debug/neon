'use client';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight,Heart} from 'lucide-react';
import {useState} from 'react';
import {builds} from '@/lib/data';
import styles from '@/app/home.module.css';
const categories=['All','JDM','Muscle','Euro','Racing','Retro','Concept'];
const images:Record<string,string>={'midnight-runner':'/assets/home-v4/build-midnight.webp','sunset-v8':'/assets/home-v4/build-sunset.webp','city-racer':'/assets/home-v4/build-city.webp','neo-tokyo':'/assets/home-v4/build-tokyo.webp','retro-legend':'/assets/home-v4/build-retro.webp'};
export function Featured(){const[category,setCategory]=useState('All');const shown=builds.filter(build=>category==='All'||build.category===category);return <section className={styles.builds}><div className={styles.buildHead}><div className={styles.buildTitle}><i/><h2>FEATURED BUILDS</h2><p>EXPLORE AMAZING CARS FROM OUR COMMUNITY</p></div><div className={styles.buildActions}><div className={styles.filters}>{categories.map(item=><button aria-pressed={category===item} onClick={()=>setCategory(item)} key={item}>{item}</button>)}</div><Link href="/market">VIEW ALL <ArrowRight size={14}/></Link></div></div><p className={styles.demo}>DEMO · OFF-CHAIN EXAMPLES</p>{shown.length?<div className={styles.buildGrid}>{shown.map((build,index)=><Link href={`/market/${build.id}`} key={build.id} className={styles.buildCard}><div className={styles.buildImage}><Image src={images[build.id]} alt={`${build.name} demo modified car`} fill sizes="(max-width: 767px) 92vw, (max-width: 1024px) 48vw, 20vw"/>{index===0&&category==='All'&&<span>FEATURED</span>}<b><Heart size={13}/> {build.likes}</b></div><div className={styles.buildInfo}><span><strong>{build.name}</strong><small>by {build.creator}</small></span><em>DEMO · {build.price||'NOT LISTED'}</em></div></Link>)}</div>:<div className={styles.empty}>No demo builds in this category yet. <Link href="/garage">Create the first one.</Link></div>}</section>}
