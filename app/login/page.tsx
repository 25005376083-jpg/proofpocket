
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400";

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/95 p-6 shadow-2xl shadow-blue-900/10 backdrop-blur sm:p-10 dark:border-slate-700 dark:bg-slate-900">

        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-blue-700 dark:text-blue-400"
        >
          ProofPocket<span className="text-slate-900 dark:text-white">.</span>
        </Link>

        <div className="mt-9">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Welcome Back
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            Sign in to your account
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-300">
            Access your personal warranty and receipt vault.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Password
              </label>

              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-blue-700 transition hover:text-blue-900 hover:underline dark:text-blue-400 dark:hover:text-blue-300 sm:text-sm"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className={`${inputClass} pr-20`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-700 hover:text-blue-900 dark:text-blue-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 py-3.5 font-bold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:from-blue-800 hover:to-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-7 text-center text-sm text-slate-600 dark:text-slate-300">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-bold text-blue-700 hover:underline dark:text-blue-400"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center dark:border-slate-700">
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 transition hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-400"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
