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
    <div className="dark min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="text-center mb-8">
          <p className="font-display text-2xl tracking-widest text-foreground">{BUSINESS_NAME}</p>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mt-2">Admin Access</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8">
          <h1 className="font-semibold text-xl text-foreground mb-6">Sign In</h1>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 mb-5 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 bg-secondary border-border text-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary h-11 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 bg-secondary border-border text-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary h-11 rounded-xl"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-1 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 hover:-translate-y-px transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin-arc" />
                  Signing in…
                </>
              ) : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
