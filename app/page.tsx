import Image from "next/image";
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
          {/* Hero photo */}
          <Image
            src="/images/hero/hockey_player.avif"
            alt=""
            fill
            priority
            className="object-cover object-center"
          />

          {/* Directional overlay — deep on the left where text lives, opens up on the right */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(8,12,16,0.92) 0%, rgba(8,12,16,0.72) 45%, rgba(8,12,16,0.35) 100%)",
            }}
          />

          {/* Bottom vignette so the scroll hint stays legible */}
          <div
            className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(8,12,16,0.6) 0%, transparent 100%)",
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
