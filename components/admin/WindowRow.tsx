"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatWindowDate, formatWindowHours } from "@/lib/booking-utils";
import type { DropOffWindow } from "@/lib/types";

export default function WindowRow({ window: win }: { window: DropOffWindow }) {
  const router = useRouter();
  const [toggling, setToggling] = useState(false);

  async function toggleBlocked() {
    setToggling(true);
    await fetch(`/api/admin/windows/${win.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_blocked: !win.is_blocked }),
    });
    router.refresh();
    setToggling(false);
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-4">
      <div>
        <p className="font-medium text-foreground text-sm">{formatWindowDate(win.date)}</p>
        <p className="font-mono text-muted-foreground text-xs mt-0.5">
          {formatWindowHours(win.open_time, win.close_time)}
        </p>
        {win.max_bookings && (
          <p className="text-muted-foreground text-xs mt-0.5">Max: {win.max_bookings}</p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`inline-flex text-[10px] font-mono uppercase tracking-wider py-1 px-2.5 rounded-md ${
          win.is_blocked
            ? "bg-destructive/15 text-destructive"
            : "bg-success/15 text-success"
        }`}>
          {win.is_blocked ? "Blocked" : "Open"}
        </span>
        <button
          onClick={toggleBlocked}
          disabled={toggling}
          className="text-xs text-muted-foreground hover:text-foreground border border-border hover:border-border/80 rounded-lg px-2.5 py-1 transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          {toggling ? "…" : win.is_blocked ? "Unblock" : "Block"}
        </button>
      </div>
    </div>
  );
}
