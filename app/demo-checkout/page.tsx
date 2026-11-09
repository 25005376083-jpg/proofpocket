
"use client";

import Link from "next/link";
import { useState } from "react";

type PaymentMethod = "easypaisa" | "jazzcash";

export default function DemoCheckoutPage() {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("easypaisa");

  const [status, setStatus] = useState<
    "idle" | "success" | "failed"
  >("idle");

  const [processing, setProcessing] = useState(false);

  function handleDemoPayment() {
    setProcessing(true);
    setStatus("idle");

    // Simulated payment only. No real transaction occurs.
    window.setTimeout(() => {
      setProcessing(false);
      setStatus("success");
    }, 1200);
  }

  return (
    <main className="min-h-screen bg-[#f5f7ff] px-4 py-10 text-slate-900 dark:bg-[#060b18] dark:text-white sm:px-6">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/pricing"
            className="text-2xl font-extrabold tracking-tight"
          >
            <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
              ProofPocket
            </span>
            <span className="text-blue-500">.</span>
          </Link>

          <Link
            href="/pricing"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold dark:border-white/10"
          >
            ← Back
          </Link>
        </div>

        {/* Heading */}
        <section className="mt-12 text-center">
          <span className="rounded-full bg-violet-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
            Demo Checkout
          </span>

          <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">
            Complete Your Upgrade
          </h1>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Experience the Pro subscription checkout.
          </p>
        </section>

        {/* Demo Notice */}
        <div className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
          <strong>Demo Mode:</strong> This is a simulated payment
          for testing and presentation. No real money will be
          transferred or collected.
        </div>

        {/* Order Summary */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-blue-900/5 dark:border-white/10 dark:bg-[#10182b] sm:p-8">

          <h2 className="text-xl font-extrabold">
            Order Summary
          </h2>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-lg font-bold">ProofPocket Pro</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Unlimited product organization
              </p>
            </div>

            <span className="rounded-xl bg-violet-100 px-3 py-2 text-sm font-bold text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
              PRO
            </span>
          </div>

          <div className="my-6 border-t border-slate-200 dark:border-white/10" />

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Subscription
            </span>
            <span className="font-semibold">Monthly</span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Plan Price
            </span>
            <span className="font-semibold">Rs. 499</span>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5 dark:border-white/10">
            <span className="font-bold">Total</span>
            <span className="text-3xl font-extrabold text-violet-600 dark:text-violet-400">
              Rs. 499
            </span>
          </div>

        </section>

        {/* Payment Methods */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-blue-900/5 dark:border-white/10 dark:bg-[#10182b] sm:p-8">

          <h2 className="text-xl font-extrabold">
            Select Payment Method
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Choose a simulated payment option.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            <button
              type="button"
              onClick={() => setPaymentMethod("easypaisa")}
              className={`rounded-2xl border-2 p-5 text-left transition ${
                paymentMethod === "easypaisa"
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                  : "border-slate-200 dark:border-white/10"
              }`}
            >
              <span className="text-2xl">📱</span>
              <p className="mt-3 font-extrabold">Easypaisa</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Demo option only
              </p>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("jazzcash")}
              className={`rounded-2xl border-2 p-5 text-left transition ${
                paymentMethod === "jazzcash"
                  ? "border-red-500 bg-red-50 dark:bg-red-500/10"
                  : "border-slate-200 dark:border-white/10"
              }`}
            >
              <span className="text-2xl">💳</span>
              <p className="mt-3 font-extrabold">JazzCash</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Demo option only
              </p>
            </button>

          </div>

          {/* Payment Button */}
          <button
            type="button"
            onClick={handleDemoPayment}
            disabled={processing || status === "success"}
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-4 text-sm font-extrabold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {processing
              ? "Processing Demo Payment..."
              : status === "success"
                ? "Demo Payment Completed"
                : `Simulate ${paymentMethod === "easypaisa" ? "Easypaisa" : "JazzCash"} Payment`}
          </button>

          {/* Payment Result */}
          {status === "success" && (
            <div className="mt-6 rounded-2xl border border-emerald-300 bg-emerald-50 p-5 text-center dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <div className="text-3xl">✓</div>
              <h3 className="mt-2 font-extrabold text-emerald-700 dark:text-emerald-400">
                Demo Payment Successful!
              </h3>
              <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
                This was a simulated transaction. No real payment
                was processed and no Pro subscription was activated.
              </p>
              <Link
                href="/dashboard"
                className="mt-5 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white"
              >
                Return to Dashboard
              </Link>
            </div>
          )}

          <p className="mt-5 text-center text-xs text-slate-400">
            🔒 Demo environment — no financial details required.
          </p>

        </section>

        <footer className="mt-10 text-center text-xs text-slate-400">
          © 2026 ProofPocket. Your purchases, your protection.
        </footer>

      </div>
    </main>
  );
}
