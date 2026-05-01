"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BUSINESS_NAME } from "@/lib/constants";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="text-center mb-8">
          <p className="font-display text-2xl tracking-widest text-text-primary">{BUSINESS_NAME}</p>
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-text mt-2">Admin Access</p>
        </div>

        <div className="bg-surface-1 border border-border/60 rounded-2xl overflow-hidden">
          <div className="h-px bg-gradient-to-r from-ice/40 via-ice/15 to-transparent" />
          <div className="p-8">
            <h1 className="font-display text-[32px] uppercase text-text-primary mb-6">Sign In</h1>

            {error && (
              <div className="bg-danger/10 border border-danger/30 rounded-xl p-3 mb-5 text-danger text-sm font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="font-mono text-[11px] uppercase tracking-widest text-muted-text">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 bg-surface-2 border-border/60 text-text-primary placeholder:text-muted-text/40 focus-visible:border-ice/60 focus-visible:shadow-[0_0_0_3px_rgba(0,212,255,0.15)] focus-visible:ring-0 h-11 rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="password" className="font-mono text-[11px] uppercase tracking-widest text-muted-text">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 bg-surface-2 border-border/60 text-text-primary placeholder:text-muted-text/40 focus-visible:border-ice/60 focus-visible:shadow-[0_0_0_3px_rgba(0,212,255,0.15)] focus-visible:ring-0 h-11 rounded-xl"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-2 rounded-full bg-ice text-background font-semibold hover:bg-white hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-background/30 border-t-background animate-spin-arc" />
                    Signing in…
                  </>
                ) : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
