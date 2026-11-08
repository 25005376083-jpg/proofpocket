
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "../lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 focus:-translate-y-0.5 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-blue-400 dark:focus:ring-blue-950";

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.session) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setMessage(
          "Account created! Please check your email to confirm your account before signing in."
        );
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 px-5 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">

      {/* Animated Background */}
      <div className="animate-login-bg pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="animate-login-bg pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400/10 blur-3xl" />

      {/* Signup Card */}
      <div className="animate-login-card relative z-10 w-full max-w-md rounded-3xl border border-white/70 bg-white/90 p-7 shadow-2xl shadow-blue-900/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-black/30 sm:p-10">

        {/* Logo */}
        <Link
          href="/"
          className="inline-block text-2xl font-extrabold tracking-tight text-blue-700 transition-transform duration-300 hover:scale-105 dark:text-blue-400"
        >
          ProofPocket<span className="text-indigo-500">.</span>
        </Link>

        {/* Heading */}
        <div className="mt-7">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Get Started Today
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create Your Account
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-300">
            Start organizing your receipts and protecting your warranties.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="mt-8 space-y-5">

          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              autoComplete="name"
              required
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
              className={inputClass}
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                autoComplete="new-password"
                required
                className={`${inputClass} pr-20`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-700 transition-colors hover:text-indigo-600 dark:text-blue-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
                className={`${inputClass} pr-20`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-700 transition-colors hover:text-indigo-600 dark:text-blue-400"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="animate-login-card rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
              {error}
            </p>
          )}

          {/* Success */}
          {message && (
            <p className="animate-login-card rounded-xl border border-green-200 bg-green-50 p-3 text-sm leading-6 text-green-700 dark:border-green-900 dark:bg-green-950/50 dark:text-green-300">
              {message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-600/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="relative z-10">
              {loading ? "Creating Account..." : "Create Account"}
            </span>
          </button>
        </form>

        {/* Sign In */}
        <p className="mt-7 text-center text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-blue-700 transition-colors hover:text-indigo-600 hover:underline dark:text-blue-400"
          >
            Sign In
          </Link>
        </p>

        {/* Back Home */}
        <div className="mt-7 border-t border-slate-200 pt-6 text-center dark:border-slate-700">
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 transition-colors hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-400"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
