
"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "../lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white";

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="animate-login-bg flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <div className="animate-login-card w-full max-w-md rounded-3xl border border-white/70 bg-white/95 p-6 shadow-2xl shadow-blue-900/10 backdrop-blur sm:p-10 dark:border-slate-700 dark:bg-slate-900">

        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-blue-700 dark:text-blue-400"
        >
          ProofPocket<span className="text-slate-900 dark:text-white">.</span>
        </Link>

        <div className="mt-9">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl dark:bg-blue-950">
            🔐
          </div>

          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Account Recovery
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            Forgot Password?
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-300">
            Enter your registered email address. We will send you a password
            reset link.
          </p>
        </div>

        <form onSubmit={handleReset} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/50 dark:text-green-300"
            >
              If an account exists for this email, a password reset link will
              be sent. Please check your inbox and spam folder.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 py-3.5 font-bold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:from-blue-800 hover:to-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending Link..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-7 text-center">
          <Link
            href="/login"
            className="text-sm font-bold text-blue-700 hover:underline dark:text-blue-400"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
