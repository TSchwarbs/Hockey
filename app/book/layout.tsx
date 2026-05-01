import { BookingProvider } from "@/components/booking/BookingStore";
import BookingSummary from "@/components/booking/BookingSummary";
import Link from "next/link";
import { BUSINESS_NAME } from "@/lib/constants";

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="font-display text-xl tracking-widest text-text-primary hover:text-ice transition-colors duration-200"
            >
              {BUSINESS_NAME}
            </Link>
            <StepRail />
          </div>
        </header>

        {/* Two-column body */}
        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
          <div className="grid lg:grid-cols-[1fr_320px] gap-10 items-start">
            {/* Left: page content */}
            <main className="min-w-0">{children}</main>
            {/* Right: persistent summary */}
            <aside className="hidden lg:block">
              <BookingSummary />
            </aside>
          </div>
        </div>
      </div>
    </BookingProvider>
  );
}

function StepRail() {
  const steps = [
    { label: "Hollow + Date", path: "/book" },
    { label: "Your Details", path: "/book/confirm" },
    { label: "Confirm", path: "/book/success" },
  ];

  return (
    <div className="hidden md:flex items-center gap-0">
      {steps.map((step, i) => (
        <StepNode key={step.label} index={i} label={step.label} total={steps.length} />
      ))}
    </div>
  );
}

function StepNode({ index, label, total }: { index: number; label: string; total: number }) {
  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center gap-1.5">
        <div className="w-2 h-2 rounded-full border border-muted-text/40 bg-transparent" />
        <span className="font-mono text-[9px] uppercase tracking-widest text-muted-text whitespace-nowrap">
          {label}
        </span>
      </div>
      {index < total - 1 && (
        <div className="w-12 h-px bg-gradient-to-r from-muted-text/20 to-muted-text/10 mb-4 mx-1" />
      )}
    </div>
  );
}
