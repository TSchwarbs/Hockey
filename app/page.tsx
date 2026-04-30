import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BUSINESS_NAME, DROP_BOX_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE, HOLLOW_OPTIONS } from "@/lib/constants";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-brand-navy text-white">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="font-semibold tracking-wide text-lg">{BUSINESS_NAME}</span>
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              Admin
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-brand-navy text-white pb-20 pt-16 px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-brand-blue text-sm font-medium tracking-widest uppercase mb-4">
              Professional Service
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Skate Sharpening,<br />Done Right.
            </h1>
            <p className="text-white/70 text-lg max-w-xl mb-10">
              Drop off your skates at our secure drop box. We sharpen them overnight and
              have them ready for pickup the next day.
            </p>
            <Link href="/book">
              <Button
                size="lg"
                className="bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold px-8 py-6 text-base"
              >
                Book a Drop-Off →
              </Button>
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-6 bg-brand-bg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-brand-navy mb-12">How it works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Book online",
                  body: "Choose your hollow depth and pick an available drop-off window. No account needed.",
                },
                {
                  step: "02",
                  title: "Drop off your skates",
                  body: `Bring your skates to the drop box at ${DROP_BOX_ADDRESS} during your chosen window.`,
                },
                {
                  step: "03",
                  title: "Pick up next day",
                  body: "Your skates are sharpened overnight and ready for pickup the following day.",
                },
              ].map(({ step, title, body }) => (
                <div key={step}>
                  <p className="text-brand-blue font-mono text-sm font-semibold mb-3">{step}</p>
                  <h3 className="font-semibold text-brand-navy text-lg mb-2">{title}</h3>
                  <p className="text-brand-steel text-sm leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service detail */}
        <section className="py-20 px-6 border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-brand-navy mb-2">Standard Skate Sharpening</h2>
            <p className="text-brand-steel mb-10">
              Professional sharpening with your choice of hollow depth.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {HOLLOW_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  className="border border-gray-200 rounded-lg p-5 bg-white"
                >
                  <p className="font-mono font-bold text-brand-navy text-xl mb-1">{option.label}</p>
                  <p className="text-sm text-brand-steel leading-relaxed">{option.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-brand-navy text-white text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to skate sharp?</h2>
            <p className="text-white/70 mb-8">
              Takes less than two minutes to book your drop-off.
            </p>
            <Link href="/book">
              <Button
                size="lg"
                className="bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold px-8"
              >
                Book Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-brand-navy text-white/50 text-sm">
        <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between gap-4">
          <span>{BUSINESS_NAME}</span>
          <div className="flex gap-6">
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white transition-colors">
              {CONTACT_EMAIL}
            </a>
            <a href={`tel:${CONTACT_PHONE}`} className="hover:text-white transition-colors">
              {CONTACT_PHONE}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
