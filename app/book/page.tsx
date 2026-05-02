"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/components/booking/BookingStore";
import CalendarPicker from "@/components/booking/CalendarPicker";
import { HOLLOW_OPTIONS } from "@/lib/constants";
import type { HollowDepth, DropOffWindow } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookPage() {
  const { hollow, setHollow, setWindow } = useBooking();
  const router = useRouter();
  const [windows, setWindows] = useState<DropOffWindow[]>([]);
  const [loadingWindows, setLoadingWindows] = useState(false);
  const [windowsError, setWindowsError] = useState<string | null>(null);

  useEffect(() => {
    if (!hollow) return;
    setLoadingWindows(true);
    setWindowsError(null);
    fetch("/api/windows")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setWindows(json.data);
        else setWindowsError("Could not load available dates. Please refresh and try again.");
      })
      .catch(() => setWindowsError("Could not load available dates. Please refresh and try again."))
      .finally(() => setLoadingWindows(false));
  }, [hollow]);

  function handleSelectHollow(value: HollowDepth) {
    setHollow(value);
  }

  function handleSelectWindow(win: DropOffWindow) {
    setWindow(win.id, win.date);
    router.push(`/book/${win.date}`);
  }

  return (
    <div className="animate-fade-up">
      {/* Step header */}
      <div className="mb-9">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2.5">
          Step 1 of 3
        </p>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Book Your Drop-Off
        </h1>
        <p className="text-sm text-muted-foreground">
          Choose your hollow depth, then pick an available drop-off date.
        </p>
      </div>

      {/* Hollow depth selection */}
      <section className="mb-9">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
          Hollow Depth
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {HOLLOW_OPTIONS.map((option) => (
            <HollowCard
              key={option.value}
              option={option}
              selected={hollow === option.value}
              onSelect={() => handleSelectHollow(option.value)}
            />
          ))}
        </div>
      </section>

      {/* Date selection — appears after hollow is chosen */}
      {hollow && (
        <section>
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
            Drop-Off Date
          </h2>

          {loadingWindows && (
            <Skeleton className="h-72 w-full rounded-xl" />
          )}

          {windowsError && (
            <p className="text-destructive text-sm">{windowsError}</p>
          )}

          {!loadingWindows && !windowsError && windows.length === 0 && (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <p className="text-muted-foreground text-sm">
                No drop-off windows available in the next 14 days.
              </p>
              <p className="text-muted-foreground/60 text-xs mt-1.5">Check back soon.</p>
            </div>
          )}

          {!loadingWindows && windows.length > 0 && (
            <CalendarPicker windows={windows} onSelect={handleSelectWindow} />
          )}
        </section>
      )}
    </div>
  );
}

function HollowCard({
  option,
  selected,
  onSelect,
}: {
  option: { value: string; label: string; description: string };
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative text-left rounded-xl border p-5 transition-all duration-150 cursor-pointer",
        selected
          ? "border-primary bg-primary/5 ring-1 ring-primary"
          : "border-border bg-card hover:border-primary/40 hover:bg-card"
      )}
    >
      {selected && (
        <span className="absolute top-3 right-3 flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
            <path d="M1.5 4l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Selected
        </span>
      )}

      <p className={cn(
        "font-display text-[44px] leading-none mb-2 transition-colors duration-150",
        selected ? "text-primary" : "text-foreground"
      )}>
        {option.label}
      </p>
      <p className="text-muted-foreground text-xs leading-relaxed">{option.description}</p>
    </button>
  );
}
