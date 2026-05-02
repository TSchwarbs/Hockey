import Image from "next/image";
import Link from "next/link";
import { BUSINESS_NAME, DROP_BOX_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE, HOLLOW_OPTIONS } from "@/lib/constants";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── Nav ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-display text-xl tracking-widest text-foreground">
            {BUSINESS_NAME}
          </span>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ────────────────────────────────────────────────── */}
        <section className="relative h-[calc(100svh-56px)] flex items-center overflow-hidden">
          <Image
            src="/images/hero/hockey_player.avif"
            alt=""
            fill
            priority
            className="object-cover object-center"
          />

          {/* Overlay: deep on the left, opens right */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, rgba(12,14,18,0.90) 0%, rgba(12,14,18,0.65) 50%, rgba(12,14,18,0.25) 100%)",
            }}
          />

          {/* Hero content — hardcoded white text over dark photo */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-lg">
              <p className="text-xs uppercase tracking-[0.2em] text-white/55 font-sans mb-5 animate-fade-up">
                Professional Skate Sharpening
              </p>
              <h1
                className="font-display text-[clamp(60px,10vw,96px)] leading-[0.9] text-white uppercase mb-7 animate-fade-up"
                style={{ animationDelay: "0.1s" }}
              >
                RAZOR
                <br />
                SHARP.
                <br />
                EVERY
                <br />
                SKATE.
              </h1>
              <p
                className="text-white/70 text-base leading-relaxed mb-9 max-w-sm animate-fade-up"
                style={{ animationDelay: "0.2s" }}
              >
                Hollow sharpening done right. Drop off tonight, skate tomorrow.
              </p>
              <div
                className="animate-fade-up"
                style={{ animationDelay: "0.3s" }}
              >
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2.5 bg-white text-gray-900 font-semibold text-sm px-7 h-12 rounded-full transition-all duration-150 hover:bg-white/90 hover:-translate-y-px select-none"
                >
                  Book Your Sharpening
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────── */}
        <section className="py-24 px-6 bg-card">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-[44px] text-foreground uppercase tracking-wide mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
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

        {/* ── Hollow depth ─────────────────────────────────────────── */}
        <section className="py-24 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-[44px] text-foreground uppercase tracking-wide mb-3">
              Choose Your Hollow
            </h2>
            <p className="text-muted-foreground mb-12 max-w-md text-sm leading-relaxed">
              The hollow is the concave groove ground into the blade base. Deeper hollows grip more; shallower ones glide faster.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              {HOLLOW_OPTIONS.map((option, i) => (
                <HollowCard key={option.value} option={option} index={i} />
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-border">
              <p className="text-muted-foreground text-sm">
                Not sure which hollow to choose?{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline underline-offset-2 hover:text-primary transition-colors">
                  Ask us.
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="py-24 px-6 bg-card">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-[clamp(44px,6vw,68px)] text-foreground uppercase leading-tight mb-5">
              Drop Off Tonight.
              <br />
              Skate Tomorrow.
            </h2>
            <p className="text-muted-foreground text-base mb-9">
              Takes less than two minutes to book your drop-off slot.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center gap-2.5 bg-primary text-primary-foreground font-semibold text-sm px-7 h-12 rounded-full transition-all duration-150 hover:bg-primary/90 hover:-translate-y-px select-none"
            >
              Reserve Your Spot
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-background border-t border-border py-7 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display text-lg tracking-widest text-foreground">
            {BUSINESS_NAME}
          </span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs text-muted-foreground">
            <span>{DROP_BOX_ADDRESS}</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-foreground transition-colors">
              {CONTACT_EMAIL}
            </a>
            <a href={`tel:${CONTACT_PHONE}`} className="hover:text-foreground transition-colors">
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
    <div className="bg-background rounded-xl border border-border p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center flex-shrink-0">
          {n}
        </span>
        <h3 className="font-semibold text-foreground text-sm">{title}</h3>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
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
    <div className="bg-card rounded-xl border border-border p-7 hover:border-primary/40 transition-colors duration-150">
      <span className="text-xs uppercase tracking-widest text-muted-foreground mb-3 block">
        {index === 0 ? "Deep Grip" : index === 1 ? "Balanced" : "Fast Glide"}
      </span>
      <p className="font-display text-[52px] leading-none text-primary mb-3">{option.label}</p>
      <p className="text-muted-foreground text-sm leading-relaxed">{option.description}</p>
    </div>
  );
}
