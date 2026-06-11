"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });

    if (error) {
      setError("Email or password is incorrect.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  const label = "block font-mono text-xs uppercase tracking-widest";
  const input =
    "mt-2 w-full border-2 border-basalt bg-chalk px-3 py-2.5 text-basalt";

  return (
    <section className="grain bg-stone2 py-16 md:py-24">
      <div className="mx-auto max-w-sm px-4">
        <span className="octagon block h-12 w-12 bg-basalt" aria-hidden="true" />
        <h1 className="mt-4 font-display text-3xl">Operator login</h1>
        <p className="mt-2 text-sm text-granite">
          For Brock&rsquo;s Gym staff. Looking to host a machine? Use the
          enquiry form instead.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <div>
            <label htmlFor="email" className={label}>
              Email
            </label>
            <input id="email" name="email" type="email" required className={input} />
          </div>
          <div>
            <label htmlFor="password" className={label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={input}
            />
          </div>
          {error && (
            <p className="border-2 border-ember bg-chalk p-3 text-sm">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-basalt px-6 py-3 font-mono text-sm uppercase tracking-widest text-chalk hover:bg-ember hover:text-basalt disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}
