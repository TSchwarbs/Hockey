import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { ApiResponse, DropOffWindow } from "@/lib/types";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse<DropOffWindow>>> {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    date: string;
    open_time: string;
    close_time: string;
    max_bookings?: number | null;
  };

  if (!body.date || !body.open_time || !body.close_time) {
    return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
  }

  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("drop_off_windows")
    .insert({
      date: body.date,
      open_time: body.open_time,
      close_time: body.close_time,
      max_bookings: body.max_bookings ?? null,
    })
    .select()
    .single<DropOffWindow>();

  if (error) {
    const duplicate = error.code === "23505";
    return NextResponse.json(
      { success: false, error: duplicate ? "A window already exists for this date." : "Failed to create window." },
      { status: duplicate ? 409 : 500 }
    );
  }

  return NextResponse.json({ success: true, data }, { status: 201 });
}
