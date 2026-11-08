
import Link from "next/link";

const freeFeatures = [
  "Up to 10 saved products",
  "Digital receipt storage",
  "Warranty tracking",
  "Expiry monitoring",
  "Product search and filters",
  "Light and Dark Mode",
];

const proFeatures = [
  "Unlimited products (fair-use policy)",
  "Digital receipt storage",
  "Advanced warranty tracking",
  "Expiry monitoring",
  "All product management features",
  "Priority support",
  "Future premium features",
];

export default function PricingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f7ff] px-4 py-10 text-slate-900 dark:bg-[#060b18] dark:text-white sm:px-6 sm:py-14">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-blue-400/15 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -right-32 top-64 h-96 w-96 rounded-full bg-violet-500/15 blur-3xl animate-pulse" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/dashboard" className="text-2xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
              ProofPocket
            </span>
            <span className="text-blue-500">.</span>
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold transition hover:border-blue-400 dark:border-white/10 dark:bg-white/5"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Heading */}
        <section className="mx-auto mt-14 max-w-2xl text-center sm:mt-20">
          <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
            Simple & Flexible Pricing
          </span>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
              Protection Plan
            </span>
          </h1>

          <p className="mt-5 text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
            Start for free and keep your purchases organized.
            Upgrade when you need more space.
          </p>
        </section>

        {/* Pricing cards */}
        <section className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2 md:gap-8">
          {/* Free Plan */}
          <div className="group rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-blue-900/5 transition duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-white/10 dark:bg-[#10182b]/90 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  STARTER PLAN
                </p>
                <h2 className="mt-2 text-2xl font-extrabold">Free</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl dark:bg-blue-500/15">
                🌱
              </div>
            </div>

            <div className="mt-7 flex items-end gap-2">
              <span className="text-5xl font-extrabold">Rs. 0</span>
              <span className="pb-2 text-sm text-slate-400">/ forever</span>
            </div>

            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Everything you need to get started.
            </p>

            <Link
              href="/dashboard"
              className="mt-7 flex w-full items-center justify-center rounded-xl border-2 border-blue-500 px-5 py-3.5 text-sm font-extrabold text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
            >
              Current Starter Option
            </Link>

            <div className="mt-8 space-y-4">
              {freeFeatures.map((feature) => (
                <div key={feature} className="flex items-start gap-3 text-sm">
                  <span className="font-bold text-emerald-500">✓</span>
                  <span className="text-slate-600 dark:text-slate-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-3xl border-2 border-violet-500 bg-white p-6 shadow-2xl shadow-violet-500/10 transition duration-300 hover:-translate-y-2 dark:bg-[#10182b] sm:p-8">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2 text-xs font-extrabold text-white shadow-lg">
              ⭐ PREMIUM PLAN
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-violet-600 dark:text-violet-400">
                  FOR POWER USERS
                </p>
                <h2 className="mt-2 text-2xl font-extrabold">Pro</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-2xl dark:bg-violet-500/15">
                🚀
              </div>
            </div>

            <div className="mt-7 flex items-end gap-2">
              <span className="text-5xl font-extrabold">Rs. 499</span>
              <span className="pb-2 text-sm text-slate-400">/ month</span>
            </div>

            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              More room and flexibility for your purchases.
            </p>

            <button
              type="button"
              disabled
              className="mt-7 w-full cursor-not-allowed rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3.5 text-sm font-extrabold text-white opacity-80"
            >
              Coming Soon
            </button>

            <div className="mt-8 space-y-4">
              {proFeatures.map((feature) => (
                <div key={feature} className="flex items-start gap-3 text-sm">
                  <span className="font-bold text-emerald-500">✓</span>
                  <span className="text-slate-600 dark:text-slate-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer note */}
        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-slate-200 bg-white/70 p-5 text-center dark:border-white/10 dark:bg-white/[0.03]">
          <p className="text-sm font-bold">🔒 Your purchases stay organized.</p>
          <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
            Pro subscriptions and online payments are not available yet.
            Your Free plan remains available while premium features are being developed.
          </p>
        </div>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-center text-xs text-slate-400 dark:border-white/10">
          © 2026 ProofPocket. Your purchases, your protection.
        </footer>
      </div>
    </main>
  );
}
