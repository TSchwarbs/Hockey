"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-4">
      <div>
        <p className="font-medium text-brand-navy text-sm">{formatWindowDate(win.date)}</p>
        <p className="text-brand-steel text-xs mt-0.5">{formatWindowHours(win.open_time, win.close_time)}</p>
        {win.max_bookings && (
          <p className="text-brand-steel text-xs mt-0.5">Max: {win.max_bookings}</p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {win.is_blocked ? (
          <Badge variant="destructive">Blocked</Badge>
        ) : (
          <Badge variant="secondary">Open</Badge>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleBlocked}
          disabled={toggling}
          className="text-xs text-brand-steel hover:text-brand-navy"
        >
          {toggling ? "…" : win.is_blocked ? "Unblock" : "Block"}
        </Button>
      </div>
    </div>
  );
}
