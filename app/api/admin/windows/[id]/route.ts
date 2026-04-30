import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { ApiResponse, DropOffWindow } from "@/lib/types";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<DropOffWindow>>> {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json() as Partial<DropOffWindow>;

  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("drop_off_windows")
    .update(body)
    .eq("id", id)
    .select()
    .single<DropOffWindow>();

  if (error) {
    return NextResponse.json({ success: false, error: "Failed to update window." }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse>> {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = await createServiceClient();
  const { error } = await supabase.from("drop_off_windows").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ success: false, error: "Failed to delete window." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
