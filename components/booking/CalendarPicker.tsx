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
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed

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
    <div className="bg-surface-1 rounded-2xl border border-border/60 p-5">
      {/* Month header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          aria-label="Previous month"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-text hover:text-text-primary hover:bg-surface-2 transition-all duration-200 disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
        >
          <ChevronLeft />
        </button>
        <span className="font-display text-[22px] uppercase tracking-widest text-text-primary">
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          aria-label="Next month"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-text hover:text-text-primary hover:bg-surface-2 transition-all duration-200 cursor-pointer"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div
            key={d}
            className="h-8 flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-muted-text"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {/* Empty cells before first day */}
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
                className="h-9 flex items-center justify-center text-sm text-muted-text/30 line-through font-mono select-none"
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
                className="h-9 rounded-lg flex items-center justify-center text-sm font-mono font-medium text-text-primary bg-ice/10 border border-ice/30 hover:bg-ice/20 hover:border-ice/60 hover:text-ice transition-all duration-200 cursor-pointer relative group"
                title={dateStr}
              >
                {day}
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-ice opacity-70 group-hover:opacity-100" />
              </button>
            );
          }

          return (
            <div
              key={day}
              className={`h-9 flex items-center justify-center text-sm font-mono select-none ${
                isToday
                  ? "text-steel font-medium"
                  : "text-muted-text/50"
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/40">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-ice/10 border border-ice/30" />
          <span className="font-mono text-[10px] text-muted-text uppercase tracking-widest">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-surface-2" />
          <span className="font-mono text-[10px] text-muted-text uppercase tracking-widest">Unavailable</span>
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
