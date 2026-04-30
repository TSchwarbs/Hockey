import { NextResponse } from "next/server";
import { getAvailableWindows } from "@/lib/booking";
import type { ApiResponse } from "@/lib/types";
import type { DropOffWindow } from "@/lib/types";

export async function GET(): Promise<NextResponse<ApiResponse<DropOffWindow[]>>> {
  try {
    const windows = await getAvailableWindows();
    return NextResponse.json({ success: true, data: windows });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to load available windows" },
      { status: 500 }
    );
  }
}
