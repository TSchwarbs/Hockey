"use client";

import { useState, useMemo } from "react";
import type { DropOffWindow } from "@/lib/types";

interface Props {
  windows: DropOffWindow[];
  onSelect: (win: DropOffWindow) => void;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CalendarPicker({ windows, onSelect }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const windowsByDate = useMemo(() => {
    const map: Record<string, DropOffWindow> = {};
    for (const w of windows) map[w.date] = w;
    return map;
  }, [windows]);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function toDateStr(day: number) {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  }

  const canGoPrev = (() => {
    const prevDate = new Date(year, month - 1, 1);
    const nowDate = new Date(today.getFullYear(), today.getMonth(), 1);
    return prevDate >= nowDate;
  })();

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      {/* Month header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          aria-label="Previous month"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150 disabled:opacity-25 disabled:pointer-events-none cursor-pointer"
        >
          <ChevronLeft />
        </button>
        <span className="font-semibold text-sm text-foreground">
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          aria-label="Next month"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150 cursor-pointer"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className="h-8 flex items-center justify-center text-[11px] uppercase tracking-wider text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = toDateStr(day);
          const cellDate = new Date(year, month, day);
          const isPast = cellDate < today;
          const isToday = cellDate.getTime() === today.getTime();
          const hasWindow = !!windowsByDate[dateStr];
          const win = windowsByDate[dateStr];

          if (isPast) {
            return (
              <div
                key={day}
                className="h-9 flex items-center justify-center text-sm text-muted-foreground/30 line-through select-none"
              >
                {day}
              </div>
            );
          }

          if (hasWindow) {
            return (
              <button
                key={day}
                onClick={() => onSelect(win)}
                className="h-9 rounded-lg flex items-center justify-center text-sm font-medium text-primary bg-primary/10 border border-primary/25 hover:bg-primary/20 hover:border-primary/50 transition-all duration-150 cursor-pointer"
                title={dateStr}
              >
                {day}
              </button>
            );
          }

          return (
            <div
              key={day}
              className={`h-9 flex items-center justify-center text-sm select-none ${
                isToday
                  ? "text-foreground font-medium"
                  : "text-muted-foreground/45"
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-primary/10 border border-primary/25" />
          <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-secondary border border-border" />
          <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Unavailable</span>
        </div>
      </div>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M5 11l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
