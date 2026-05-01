import Link from "next/link";
import { BUSINESS_NAME, DROP_BOX_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE, HOLLOW_OPTIONS } from "@/lib/constants";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      {/* ── Nav ─────────────────────────────────────────────────── */}
      <header className="absolute top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <span className="font-display text-2xl tracking-widest text-text-primary">
            {BUSINESS_NAME}
          </span>
          <Link
            href="/admin/dashboard"
            className="text-muted-text text-xs font-mono tracking-widest uppercase hover:text-steel transition-colors duration-200"
          >
            Admin ↗
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center overflow-hidden grain-overlay">
          {/* Diagonal background split */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(118deg, #080C10 0%, #080C10 54%, #0F1923 54%, #0F1923 100%)",
            }}
          />

          {/* Ice-blue atmospheric glow top-right */}
          <div
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 80% 20%, rgba(0,212,255,0.08) 0%, transparent 65%)",
            }}
          />

          {/* Blade graphic — right side */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center pointer-events-none select-none">
            <BladeSVG />
          </div>

          {/* Ice crystals — bottom right corner */}
          <div className="absolute bottom-10 right-10 pointer-events-none select-none opacity-20">
            <IceCrystals />
          </div>

          {/* Hero content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-24">
            <div className="max-w-xl">
              <p
                className="font-mono text-ice text-xs tracking-[0.25em] uppercase mb-6 animate-fade-up"
                style={{ animationDelay: "0.1s" }}
              >
                Performance-Grade Precision
              </p>
              <h1
                className="font-display text-[clamp(64px,10vw,96px)] leading-[0.92] text-text-primary uppercase mb-8 animate-fade-up"
                style={{ animationDelay: "0.2s" }}
              >
                RAZOR
                <br />
                <span className="text-ice">SHARP.</span>
                <br />
                EVERY
                <br />
                SKATE.
              </h1>
              <p
                className="text-steel text-lg leading-relaxed mb-10 max-w-md animate-fade-up"
                style={{ animationDelay: "0.35s" }}
              >
                Professional hollow sharpening. Drop off tonight. Skate tomorrow.
              </p>
              <div
                className="animate-fade-up"
                style={{ animationDelay: "0.45s" }}
              >
                <Link
                  href="/book"
                  className="inline-flex items-center gap-3 bg-ice text-background font-semibold text-base px-8 h-14 rounded-full transition-all duration-200 hover:bg-white hover:-translate-y-0.5 animate-glow-pulse cursor-pointer select-none"
                >
                  Book Your Sharpening
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 animate-fade-up" style={{ animationDelay: "1s" }}>
            <div className="w-px h-10 bg-gradient-to-b from-transparent to-steel" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-muted-text">Scroll</span>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────── */}
        <section className="py-28 px-6 bg-surface-1">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-baseline gap-4 mb-16">
              <h2 className="font-display text-[48px] text-text-primary uppercase tracking-wide">
                How It Works
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  n: "1",
                  title: "Book Online",
                  body: "Choose your hollow depth and pick an available drop-off window. Takes under two minutes. No account needed.",
                },
                {
                  n: "2",
                  title: "Drop Off",
                  body: `Bring your skates to the secure drop box at ${DROP_BOX_ADDRESS} during your chosen window.`,
                },
                {
                  n: "3",
                  title: "Skate Tomorrow",
                  body: "Your skates are sharpened to specification overnight and ready for pickup the following day.",
                },
              ].map(({ n, title, body }) => (
                <HowItWorksCard key={n} n={n} title={title} body={body} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Hollow depth section ──────────────────────────────────── */}
        <section className="py-28 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-baseline gap-4 mb-4">
              <h2 className="font-display text-[48px] text-text-primary uppercase tracking-wide">
                Choose Your Hollow
              </h2>
            </div>
            <p className="text-muted-text mb-14 max-w-lg">
              The hollow depth is the concave groove ground into the blade&apos;s base. Deeper hollows grip more; shallower ones glide faster.
            </p>

            <div className="grid md:grid-cols-3 gap-5">
              {HOLLOW_OPTIONS.map((option, i) => (
                <HollowCard key={option.value} option={option} index={i} />
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-border/50">
              <p className="text-muted-text text-sm">
                Not sure which hollow to choose?{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-ice hover:underline transition-colors">
                  Ask us — we&apos;ll help you decide.
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA banner ────────────────────────────────────────────── */}
        <section className="py-28 px-6 bg-surface-1 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 100%, rgba(0,212,255,0.07) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="font-display text-[clamp(48px,6vw,72px)] text-text-primary uppercase leading-tight mb-6">
              Drop Off Tonight.
              <br />
              <span className="text-ice">Skate Tomorrow.</span>
            </h2>
            <p className="text-muted-text text-lg mb-10 max-w-md mx-auto">
              Takes less than two minutes to book your drop-off slot.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center gap-3 bg-ice text-background font-semibold text-base px-8 h-14 rounded-full transition-all duration-200 hover:bg-white hover:-translate-y-0.5 cursor-pointer select-none"
            >
              Reserve Your Spot
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-background border-t border-border/50 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-xl tracking-widest text-text-primary">
            {BUSINESS_NAME}
          </span>
          <div className="flex gap-6 font-mono text-xs tracking-wider text-muted-text">
            <span>{DROP_BOX_ADDRESS}</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-steel transition-colors">
              {CONTACT_EMAIL}
            </a>
            <a href={`tel:${CONTACT_PHONE}`} className="hover:text-steel transition-colors">
              {CONTACT_PHONE}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────── */

function HowItWorksCard({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="relative bg-surface-2 rounded-2xl p-7 border border-border/60 overflow-hidden group hover:border-ice/30 transition-all duration-200">
      {/* Watermark number */}
      <span
        className="absolute -top-2 -right-2 font-display text-[120px] leading-none text-text-primary select-none pointer-events-none"
        style={{ opacity: 0.055 }}
        aria-hidden
      >
        {n}
      </span>
      {/* Step dot */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1.5 h-1.5 rounded-full bg-ice" />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-text">
          Step {n}
        </span>
      </div>
      <h3 className="font-display text-[24px] text-text-primary uppercase tracking-wide mb-3">
        {title}
      </h3>
      <p className="text-muted-text text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function HollowCard({
  option,
  index,
}: {
  option: { value: string; label: string; description: string };
  index: number;
}) {
  return (
    <div
      className="group relative bg-surface-1 rounded-2xl border border-border/60 p-8 overflow-hidden hover:border-ice/40 hover:-translate-y-1 transition-all duration-200 cursor-default"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.04) 0%, transparent 60%)" }}
      />
      <div className="relative z-10">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-text mb-4 block">
          {index === 0 ? "Deep Grip" : index === 1 ? "Balanced" : "Fast Glide"}
        </span>
        <p className="font-display text-[56px] leading-none text-ice mb-4">{option.label}</p>
        <p className="text-muted-text text-sm leading-relaxed">{option.description}</p>
      </div>
    </div>
  );
}

function BladeSVG() {
  return (
    <svg
      viewBox="0 0 480 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-md h-auto opacity-80"
      aria-hidden
    >
      <defs>
        <linearGradient id="blade-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#080C10" />
          <stop offset="40%" stopColor="#162232" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="blade-edge" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity="0" />
          <stop offset="30%" stopColor="#00D4FF" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#00D4FF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="blade-glow" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity="0" />
          <stop offset="50%" stopColor="#00D4FF" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
        </linearGradient>
        <filter id="blade-blur">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      {/* Glow halo behind blade */}
      <ellipse cx="280" cy="350" rx="120" ry="280" fill="url(#blade-glow)" filter="url(#blade-blur)" />

      {/* Main blade body */}
      <path
        d="M160 80 L380 140 L400 590 L140 560 Z"
        fill="url(#blade-body)"
        opacity="0.7"
      />

      {/* Right edge — the sharp edge */}
      <line x1="388" y1="148" x2="398" y2="582" stroke="url(#blade-edge)" strokeWidth="2.5" />

      {/* Left edge */}
      <line x1="152" y1="94" x2="143" y2="566" stroke="#C0D9E8" strokeWidth="1" opacity="0.25" />

      {/* Cross-section lines for depth/precision feel */}
      {[160, 220, 280, 340, 400, 460, 520].map((y, i) => {
        const progress = i / 6;
        const x1 = 152 + progress * 10;
        const x2 = 388 + progress * 8;
        return (
          <line
            key={y}
            x1={x1} y1={y}
            x2={x2} y2={y + 5}
            stroke="#C0D9E8"
            strokeWidth="0.5"
            opacity={0.08 + progress * 0.04}
          />
        );
      })}

      {/* Hollow groove at bottom — the curve */}
      <path
        d="M148 555 Q270 600 396 576"
        stroke="#00D4FF"
        strokeWidth="1.5"
        strokeDasharray="5 4"
        opacity="0.5"
      />

      {/* Edge highlight sparkle dots */}
      <circle cx="393" cy="280" r="2.5" fill="#00D4FF" opacity="0.9" />
      <circle cx="395" cy="350" r="1.8" fill="#00D4FF" opacity="0.7" />
      <circle cx="396" cy="440" r="2" fill="#00D4FF" opacity="0.8" />

      {/* Top geometry — mounting screws visual */}
      <rect x="195" y="92" width="6" height="6" rx="3" fill="#C0D9E8" opacity="0.4" transform="rotate(-8 195 92)" />
      <rect x="310" y="118" width="6" height="6" rx="3" fill="#C0D9E8" opacity="0.4" transform="rotate(-8 310 118)" />

      {/* Grid lines — technical aesthetic */}
      <line x1="100" y1="350" x2="420" y2="350" stroke="#00D4FF" strokeWidth="0.5" opacity="0.08" strokeDasharray="3 6" />
      <line x1="270" y1="50" x2="270" y2="650" stroke="#00D4FF" strokeWidth="0.5" opacity="0.06" strokeDasharray="3 6" />
    </svg>
  );
}

function IceCrystals() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-40" aria-hidden>
      {/* Hexagonal crystal pattern */}
      <line x1="100" y1="10" x2="100" y2="190" stroke="#00D4FF" strokeWidth="1" />
      <line x1="10" y1="100" x2="190" y2="100" stroke="#00D4FF" strokeWidth="1" />
      <line x1="29" y1="29" x2="171" y2="171" stroke="#00D4FF" strokeWidth="1" />
      <line x1="171" y1="29" x2="29" y2="171" stroke="#00D4FF" strokeWidth="1" />

      {/* Tick marks on each arm */}
      {[40, 60, 80, 120, 140, 160].map((pos) => (
        <g key={pos}>
          <line x1={pos} y1="96" x2={pos} y2="104" stroke="#00D4FF" strokeWidth="1.5" />
          <line x1="96" y1={pos} x2="104" y2={pos} stroke="#00D4FF" strokeWidth="1.5" />
        </g>
      ))}

      {/* Center hexagon */}
      <polygon
        points="100,82 115,91 115,109 100,118 85,109 85,91"
        stroke="#00D4FF"
        strokeWidth="1"
        fill="none"
      />
      <circle cx="100" cy="100" r="4" fill="#00D4FF" />
    </svg>
  );
}
