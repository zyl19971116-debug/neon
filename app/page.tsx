import Link from "next/link";
import {
  ArrowRight,
  PenTool,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";
import { Featured } from "@/components/Featured";
const features = [
  [
    "01",
    "CUSTOMIZE",
    "Build your unique digital car with parts, colors, decals and more.",
    "/garage",
    Sparkles,
  ],
  [
    "02",
    "MINT ON-CHAIN",
    "Turn your build into a verifiable NFT on Robinhood Chain.",
    "/garage",
    PenTool,
  ],
  [
    "03",
    "TRADE & COLLECT",
    "Discover listed cars and original designs from creators.",
    "/market",
    ShoppingBag,
  ],
  [
    "04",
    "JOIN THE CULTURE",
    "Show your garage and join a growing community.",
    "/community",
    Users,
  ],
];
export default function Home() {
  return (
    <main className="pt-[68px]">
      <section className="relative min-h-[680px] lg:h-[73vh] lg:min-h-[700px] bg-[#e7ad79] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_25%,#fff2cf_0,transparent_37%),linear-gradient(110deg,#f5d1a5_0%,#ec7f4c_46%,#0b2527_100%)]" />
        <div className="absolute inset-0 bg-[url('/assets/hero/neon-garage-sunset.png')] bg-cover bg-[68%_center] md:bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f7d3ab] via-[#f7d3ab]/90 md:via-[#f7d3ab]/70 to-[#f7d3ab]/45 md:to-transparent" />
        <div className="absolute inset-y-0 right-0 w-[64%] hidden">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(8,27,29,.12)_25%,#071a1c_100%)]" />
          <div className="absolute bottom-[17%] right-[7%] w-[70%] h-[30%] rounded-[45%_60%_20%_20%] bg-gradient-to-r from-stone-100 via-orange-100 to-orange shadow-2xl rotate-[-2deg]">
            <div className="absolute left-[25%] -top-[60%] w-[48%] h-[77%] rounded-t-[80%] bg-slate-700/90 border-[8px] border-orange-100 skew-x-[-13deg]" />
            <div className="absolute left-[7%] -bottom-[35%] size-[29%] rounded-full bg-black border-[12px] border-zinc-600" />
            <div className="absolute right-[9%] -bottom-[35%] size-[29%] rounded-full bg-black border-[12px] border-zinc-600" />
            <span className="absolute left-[48%] top-[33%] race text-4xl border-4 border-ink rounded-full size-16 grid place-items-center">
              77
            </span>
          </div>
          <div className="absolute right-[5%] top-[13%] border-[12px] border-ink/30 bg-ink/70 w-[62%] h-[47%]">
            <p className="race text-orange text-4xl text-center mt-8 drop-shadow-[0_0_8px_#ff5b20]">
              NEON GARAGE
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-3/5 bg-[repeating-linear-gradient(90deg,#0c2526_0_11%,#183638_11%_12%)]" />
          </div>
        </div>
        <div className="relative max-w-[1450px] mx-auto h-full px-6 lg:px-16 pt-12">
          <div className="max-w-[560px] relative z-10">
            <h1 className="race text-[68px] sm:text-[92px] lg:text-[105px] leading-[.82]">
              BUILD
              <br />
              <span className="text-orange">DRIVE</span>
              <br />
              COLLECT
            </h1>
            <p className="mt-2 text-orange text-4xl sm:text-5xl italic font-serif -rotate-2">
              Your Dream Ride
            </p>
            <p className="mt-5 text-sm font-bold leading-5">
              A WEB3 GARAGE FOR DIGITAL CAR ENTHUSIASTS.
              <br />
              CUSTOMIZE. OWN. TRADE. SHOW OFF.
            </p>
            <Link href="/garage" className="btn btn-orange mt-6 px-9">
              Start building <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <div className="relative lg:absolute bottom-0 inset-x-0 px-4 lg:px-6 z-20">
          <div className="max-w-[1490px] mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {features.map(([n, t, d, h, Icon]: any) => (
              <Link
                key={n}
                href={h}
                className="panel p-5 min-h-[132px] group flex gap-4"
              >
                <div className="flex-1">
                  <h3 className="race text-lg">
                    <span className="text-orange mr-3">{n}</span>
                    {t}
                  </h3>
                  <p className="text-xs leading-5 text-white/75 mt-3">{d}</p>
                </div>
                <Icon className="text-orange self-end group-hover:translate-x-1 transition" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Featured />
      <section className="bg-ink text-white px-6 lg:px-16 py-11">
        <div className="max-w-[1450px] mx-auto grid lg:grid-cols-[1fr_.7fr_1.2fr] gap-10 items-center">
          <div className="h-48 rounded-lg bg-[radial-gradient(circle_at_20%_50%,#ff5b20,transparent_25%),radial-gradient(circle_at_40%_55%,#55311d,transparent_30%),#020b0c] grid place-items-center">
            <div className="size-32 rounded-full border-[14px] border-zinc-700 grid place-items-center race text-2xl">
              NG
            </div>
          </div>
          <h2 className="race text-5xl">
            CREATOR
            <br />
            ECONOMY
          </h2>
          <div>
            <p className="max-w-lg text-sm leading-6 text-white/80">
              Design and sell your own car parts, decals and liveries. Earn
              royalties whenever your designs are used in qualifying
              transactions.
            </p>
            <Link href="/create" className="btn btn-orange mt-5">
              Start creating <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
