import { BookingProvider } from "@/components/booking/BookingStore";
import BookingSummary from "@/components/booking/BookingSummary";
import Link from "next/link";
import { BUSINESS_NAME } from "@/lib/constants";

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-background sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="font-display text-xl tracking-widest text-foreground hover:text-primary transition-colors duration-150"
            >
              {BUSINESS_NAME}
            </Link>
            <StepRail />
          </div>
        </header>

        {/* Two-column body */}
        <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
          <div className="grid lg:grid-cols-[1fr_300px] gap-10 items-start">
            <main className="min-w-0">{children}</main>
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
  const steps = ["Hollow + Date", "Your Details", "Confirm"];
  return (
    <div className="hidden sm:flex items-center gap-1.5">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="w-6 h-px bg-border mx-0.5" />
          )}
        </div>
      ))}
    </div>
  );
}
