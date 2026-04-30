import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { ApiResponse, DropOffWindow } from "@/lib/types";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ date: string }> }
): Promise<NextResponse<ApiResponse<DropOffWindow>>> {
  const { date } = await params;
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from("drop_off_windows")
    .select("*")
    .eq("date", date)
    .eq("is_blocked", false)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { success: false, error: "Window not found or not available" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data });
}
