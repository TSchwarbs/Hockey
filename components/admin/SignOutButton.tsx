"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminSignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <button
      onClick={handleSignOut}
      className="font-mono text-[10px] uppercase tracking-widest text-muted-text hover:text-danger border border-border/40 hover:border-danger/30 rounded-lg px-3 py-1.5 transition-all duration-200 cursor-pointer"
    >
      Sign out
    </button>
  );
}
