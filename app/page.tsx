import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Featured } from '@/components/Featured';
import styles from './home.module.css';

const features = [
  { n: '01', title: 'CUSTOMIZE', copy: 'Build your unique digital car with parts, colors, decals and more.', href: '/garage', image: '/assets/home-v4/feature-customize.webp', alt: 'Deep-lip racing wheel being fitted in a sunset garage' },
  { n: '02', title: 'MINT ON-CHAIN', copy: 'Prepare a verifiable build once wallet and contract requirements are met.', href: '/garage', image: '/assets/home-v4/feature-mint.webp', alt: 'Racing components and engraved identity plate on a workbench' },
  { n: '03', title: 'TRADE & COLLECT', copy: 'Discover demo cars and original designs from automotive creators.', href: '/market', image: '/assets/home-v4/feature-market.webp', alt: 'Collection of retro modified cars in a sunset showroom' },
  { n: '04', title: 'JOIN THE CULTURE', copy: 'Show your garage and join a growing community of builders.', href: '/community', image: '/assets/home-v4/feature-community.webp', alt: 'Vintage racing helmet and gloves in a retro workshop' },
];

export default function Home() {
  return <main className={styles.home}>
    <section className={styles.hero}>
      <Image src="/assets/home-v4/hero-garage.webp" alt="Silver number 77 widebody racing coupe in a sunset industrial garage" fill priority sizes="100vw" className={styles.heroImage} />
      <div className={styles.heroShade} />
      <div className={styles.heroCopy}>
        <p className={styles.kicker}>A WEB3 GARAGE FOR <span>DIGITAL CAR ENTHUSIASTS</span></p>
        <h1>BUILD<br /><em>DRIVE</em><br />COLLECT</h1>
        <p className={styles.script}>Your Dream Ride</p>
        <p className={styles.heroBody}>CUSTOMIZE. OWN. TRADE. SHOW OFF.</p>
        <Link href="/garage" className={styles.primary}>START BUILDING <ArrowRight size={17} /></Link>
      </div>
      <div className={styles.features}>
        {features.map((feature) => <Link key={feature.n} href={feature.href} className={styles.featureCard}>
          <Image src={feature.image} alt={feature.alt} fill sizes="(max-width: 768px) 86vw, (max-width: 1200px) 50vw, 25vw" />
          <span className={styles.cardShade} />
          <span className={styles.featureText}><b><i>{feature.n}</i> {feature.title}</b><small>{feature.copy}</small></span>
        </Link>)}
      </div>
    </section>
    <Featured />
    <section className={styles.creator}>
      <Image src="/assets/home-v4/creator-economy.webp" alt="Automotive design workbench with helmet, wheel and digital car sketch" fill sizes="100vw" />
      <div className={styles.creatorShade} />
      <div className={styles.creatorContent}>
        <span>NEON <i>GARAGE</i></span>
        <h2>CREATOR ECONOMY</h2>
        <p>Design and sell your own car parts, decals and liveries.<br />Earn royalties whenever your designs are used in qualifying transactions.</p>
        <div><Link href="/create" className={styles.primary}>START CREATING <ArrowRight size={16} /></Link><Link href="/create" className={styles.secondary}>LEARN MORE</Link></div>
      </div>
    </section>
  </main>;
}
