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
        else setWindowsError("Could not load available dates.");
      })
      .catch(() => setWindowsError("Could not load available dates."))
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
      <div className="mb-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ice mb-3">
          Step 1 of 3
        </p>
        <h1 className="font-display text-[48px] leading-tight uppercase text-text-primary mb-3">
          Book Your Drop-Off
        </h1>
        <p className="text-muted-text">
          Choose your hollow depth, then pick an available drop-off date.
        </p>
      </div>

      {/* Hollow depth selection */}
      <section className="mb-10">
        <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-text mb-4">
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
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-text mb-4">
            Drop-Off Date
          </h2>

          {loadingWindows && (
            <div className="space-y-3">
              <Skeleton className="h-72 w-full rounded-2xl" />
            </div>
          )}

          {windowsError && (
            <p className="text-danger text-sm font-mono">{windowsError}</p>
          )}

          {!loadingWindows && !windowsError && windows.length === 0 && (
            <div className="bg-surface-1 rounded-2xl border border-border/60 p-8 text-center">
              <p className="text-muted-text text-sm">
                No drop-off windows are available in the next 14 days.
              </p>
              <p className="text-muted-text/60 text-xs mt-2 font-mono">Check back soon.</p>
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
        "relative text-left rounded-2xl border p-6 transition-all duration-200 group cursor-pointer overflow-hidden",
        selected
          ? "border-ice bg-ice/8 shadow-[0_0_0_1px_rgba(0,212,255,0.5),0_0_20px_rgba(0,212,255,0.08)]"
          : "border-border/60 bg-surface-1 hover:border-ice/40 hover:-translate-y-0.5"
      )}
    >
      {/* Selected badge */}
      {selected && (
        <span className="absolute top-3 right-3 flex items-center gap-1 bg-ice text-background text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
            <path d="M1.5 4l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Selected
        </span>
      )}

      {/* Hover glow */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-200",
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
        style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.05) 0%, transparent 60%)" }}
      />

      <div className="relative z-10">
        <p className={cn("font-display text-[48px] leading-none mb-3 transition-colors duration-200",
          selected ? "text-ice" : "text-text-primary group-hover:text-ice/80"
        )}>
          {option.label}
        </p>
        <p className="text-muted-text text-xs leading-relaxed">{option.description}</p>
      </div>
    </button>
  );
}
