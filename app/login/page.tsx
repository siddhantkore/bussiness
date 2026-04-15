"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const demoAccounts = [
  { label: "Admin", email: "admin@land.local", password: "admin123" },
  { label: "Reviewer", email: "reviewer@land.local", password: "reviewer123" },
  { label: "Issuer", email: "issuer@land.local", password: "issuer123" },
  { label: "Investor", email: "investor@land.local", password: "investor123" },
  { label: "Stakeholder", email: "stakeholder@land.local", password: "stakeholder123" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(demoAccounts[0].email);
  const [password, setPassword] = useState(demoAccounts[0].password);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/prototype/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setPending(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "Login failed" }));
      setError(data.error ?? "Login failed");
      return;
    }

    const next = new URLSearchParams(window.location.search).get("next");
    router.replace(next || "/");
    router.refresh();
  }

  function selectAccount(account: (typeof demoAccounts)[number]) {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  }

  return (
    <main className="min-h-screen bg-[#08090b] px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs uppercase text-white/45">Land records prototype</p>
        <h1 className="mt-2 text-4xl font-semibold">Sign in</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/60">
          Use a demo role to access the relevant panel. Sessions are stored in an HTTP-only cookie.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1.2fr]">
          <section className="space-y-3">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => selectAccount(account)}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-[#f7d8b0]/50"
              >
                <span className="block text-sm font-semibold">{account.label}</span>
                <span className="mt-1 block text-xs text-white/55">{account.email}</span>
              </button>
            ))}
          </section>

          <form onSubmit={onSubmit} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm">
                <span className="text-white/70">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="rounded-lg border border-white/10 bg-[#121418] px-3 py-2"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span className="text-white/70">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="rounded-lg border border-white/10 bg-[#121418] px-3 py-2"
                  required
                />
              </label>
            </div>
            {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
            <button
              type="submit"
              disabled={pending}
              className="mt-5 w-full rounded-lg bg-[#f7d8b0] px-3 py-2 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
