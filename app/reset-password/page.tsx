
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createClient } from "../lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const verificationStarted = useRef(false);

  useEffect(() => {
    if (verificationStarted.current) return;
    verificationStarted.current = true;

    const supabase = createClient();

    async function verifyResetLink() {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (code) {
          const { error } =
            await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            setError(
              "Reset link is invalid or expired. Please request a new link."
            );
            return;
          }

          window.history.replaceState(
            {},
            document.title,
            "/reset-password"
          );
        }

        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          setError(
            "Reset link is invalid or expired. Please request a new link."
          );
        }
      } catch {
        setError("Unable to verify reset link. Please request a new one.");
      } finally {
        setChecking(false);
      }
    }

    verifyResetLink();
  }, []);

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
      await supabase.auth.signOut();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white";

  return (
    <main className="animate-login-bg flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <div className="animate-login-card w-full max-w-md rounded-3xl border border-white/70 bg-white/95 p-6 shadow-2xl shadow-blue-900/10 backdrop-blur sm:p-10 dark:border-slate-700 dark:bg-slate-900">

        <Link
          href="/"
          className="text-2xl font-extrabold text-blue-700 dark:text-blue-400"
        >
          ProofPocket.
        </Link>

        <div className="mt-9">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Account Recovery
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            Set New Password
          </h1>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">
            Create a new password for your ProofPocket account.
          </p>
        </div>

        {checking ? (
          <p className="mt-8 text-sm text-slate-500 dark:text-slate-300">
            Verifying your reset link...
          </p>
        ) : success ? (
          <div className="mt-8 space-y-5">
            <p className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/50 dark:text-green-300">
              Your password has been updated successfully. You can now sign in
              using your new password.
            </p>

            <Link
              href="/login"
              className="block w-full rounded-xl bg-blue-700 py-3.5 text-center font-bold text-white transition hover:bg-blue-800"
            >
              Go to Login
            </Link>
          </div>
        ) : error ? (
          <div className="mt-8 space-y-5">
            <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-300">
              {error}
            </p>

            <Link
              href="/forgot-password"
              className="block w-full rounded-xl bg-blue-700 py-3.5 text-center font-bold text-white transition hover:bg-blue-800"
            >
              Request New Reset Link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                New Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  minLength={8}
                  required
                  autoComplete="new-password"
                  className={`${inputClass} pr-20`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-700 dark:text-blue-400"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Confirm New Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                minLength={8}
                required
                autoComplete="new-password"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 py-3.5 font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        )}

        <div className="mt-7 border-t border-slate-200 pt-6 text-center dark:border-slate-700">
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
