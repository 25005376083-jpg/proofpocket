
import Link from "next/link";

const features = [
  {
    icon: "📁",
    title: "Digital Receipt Vault",
    description:
      "Keep all your purchase receipts organized in one secure digital place.",
    color: "blue",
  },
  {
    icon: "🛡️",
    title: "Warranty Protection",
    description:
      "Track warranty periods and stay informed before your coverage expires.",
    color: "purple",
  },
  {
    icon: "⏰",
    title: "Expiry Reminders",
    description:
      "Identify warranties that are expiring soon and take action on time.",
    color: "amber",
  },
  {
    icon: "🔎",
    title: "Easy Organization",
    description:
      "Find your products and purchase details whenever you need them.",
    color: "green",
  },
];

const stats = [
  { label: "Total Products", value: "12", color: "blue" },
  { label: "Active Warranties", value: "08", color: "green" },
  { label: "Expiring Soon", value: "02", color: "amber" },
  { label: "Expired", value: "02", color: "red" },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8ff] text-slate-900 dark:bg-[#050816] dark:text-white">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#080d20]/85">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <Link href="/" className="text-2xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
              ProofPocket
            </span>
            <span className="text-blue-500">.</span>
          </Link>

          <div className="hidden items-center gap-9 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
            <a href="#features" className="transition hover:text-blue-500">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-blue-500">
              How It Works
            </a>
            <a href="#about" className="transition hover:text-blue-500">
              About
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden text-sm font-semibold transition hover:text-blue-500 sm:block"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition duration-300 hover:-translate-y-1 hover:shadow-blue-500/40"
            >
              Get Started <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative isolate">
        <div className="pointer-events-none absolute -left-40 top-10 -z-10 h-96 w-96 rounded-full bg-blue-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-20 -z-10 h-96 w-96 rounded-full bg-violet-500/15 blur-[120px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 md:grid-cols-2 md:px-10 md:py-28">

          {/* LEFT CONTENT */}
          <div className="hero-content">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
              Your purchases. Your protection.
            </div>

            <h1 className="mt-8 text-5xl font-black leading-[1.12] tracking-tight md:text-6xl lg:text-7xl">
              Never Lose a
              <span className="mt-2 block bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                Warranty Again.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-400 md:text-lg">
              Your purchases deserve protection. Organize receipts, manage
              product warranties and keep every important purchase detail
              in one smart digital pocket.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="group rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-7 py-4 font-bold text-white shadow-xl shadow-blue-500/20 transition duration-300 hover:-translate-y-1 hover:shadow-blue-500/40"
              >
                Start Protecting Your Purchases
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <a
                href="#features"
                className="rounded-xl border border-slate-300 bg-white/70 px-7 py-4 font-bold text-slate-700 transition duration-300 hover:-translate-y-1 hover:border-blue-400 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-blue-400"
              >
                Explore Features
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
              <span>✓ Easy to use</span>
              <span>✓ Secure storage</span>
              <span>✓ All in one place</span>
            </div>
          </div>

          {/* RIGHT DASHBOARD PREVIEW */}
          <div className="dashboard-float relative">
            <div className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-gradient-to-br from-blue-500/20 to-violet-500/20 blur-2xl" />

            <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-2xl shadow-blue-950/10 backdrop-blur-xl dark:border-white/10 dark:bg-[#10182d]/95 dark:shadow-black/40 md:p-7">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Your Protection Overview
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold">
                    My Pocket
                  </h2>
                </div>

                <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-bold text-green-600 dark:text-green-400">
                  ● Demo Preview
                </span>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="group rounded-2xl border border-slate-100 bg-slate-50 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/5 dark:bg-white/[0.04]"
                  >
                    <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                      {stat.label}
                    </p>
                    <p
                      className={`mt-3 text-3xl font-extrabold ${
                        stat.color === "blue"
                          ? "text-blue-600 dark:text-blue-400"
                          : stat.color === "green"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : stat.color === "amber"
                              ? "text-amber-500"
                              : "text-red-500"
                      }`}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 p-5 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Upcoming Expirations</h3>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    Preview
                  </span>
                </div>

                <div className="mt-5 space-y-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl dark:bg-blue-500/10">
                        💻
                      </div>
                      <div>
                        <p className="text-sm font-bold">Laptop Warranty</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Dell Inspiron
                        </p>
                      </div>
                    </div>
                    <span className="whitespace-nowrap rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                      12 days left
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-xl dark:bg-violet-500/10">
                        📱
                      </div>
                      <div>
                        <p className="text-sm font-bold">Mobile Warranty</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Samsung Galaxy
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-xl bg-blue-50 p-4 dark:bg-blue-500/10">
                <span className="text-xl">🔒</span>
                <p className="text-xs leading-5 text-slate-600 dark:text-slate-300">
                  Your purchase information, organized in one place.
                </p>
              </div>
            </div>

            <div className="absolute -right-3 -top-5 hidden animate-bounce rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold shadow-xl dark:border-white/10 dark:bg-[#17213a] sm:block">
              🛡️ Warranty Protected
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="border-y border-slate-200 bg-white/70 px-6 py-24 dark:border-white/5 dark:bg-[#0a1020] md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold tracking-[0.2em] text-blue-600 dark:text-blue-400">
              WHY PROOFPOCKET?
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
              Everything You Need to
              <span className="block text-blue-600 dark:text-blue-400">
                Protect Your Purchases
              </span>
            </h2>
            <p className="mt-5 leading-8 text-slate-600 dark:text-slate-400">
              A simple and organized way to manage your receipts and warranties.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="feature-card group rounded-3xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-2 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/10 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-blue-500/40"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/15 to-violet-500/15 text-3xl transition duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-lg font-extrabold">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
                <div className="mt-5 h-1 w-10 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300 group-hover:w-20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="relative overflow-hidden px-6 py-24 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-bold tracking-[0.2em] text-blue-600 dark:text-blue-400">
              SIMPLE PROCESS
            </p>
            <h2 className="mt-4 text-3xl font-extrabold md:text-5xl">
              How ProofPocket Works
            </h2>
          </div>

          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {[
              ["01", "Create Your Account", "Register to access your personal dashboard.", "👤"],
              ["02", "Add Your Purchases", "Save product details and upload receipts.", "📄"],
              ["03", "Track Your Warranties", "Monitor warranty status and expiry dates.", "🛡️"],
            ].map(([number, title, description, icon]) => (
              <div
                key={number}
                className="group rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-white/10 dark:bg-[#10182d]"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-3xl text-white shadow-lg shadow-blue-500/20 transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                  {icon}
                </div>
                <p className="mt-6 text-sm font-extrabold tracking-widest text-blue-600 dark:text-blue-400">
                  STEP {number}
                </p>
                <h3 className="mt-3 text-xl font-extrabold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT / CTA */}
      <section id="about" className="px-6 pb-20 md:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 px-7 py-16 text-center text-white shadow-2xl shadow-blue-900/20 md:px-16 md:py-20">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-bold tracking-[0.2em] text-blue-100">
              YOUR DIGITAL PURCHASE COMPANION
            </p>
            <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold md:text-5xl">
              Keep Every Purchase Protected.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-blue-100">
              ProofPocket brings your receipts and warranty information together
              so you can stay organized and make informed decisions.
            </p>
            <Link
              href="/signup"
              className="mt-9 inline-block rounded-xl bg-white px-8 py-4 font-bold text-blue-700 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-blue-50"
            >
              Get Started Today →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-6 py-9 dark:border-white/10 dark:bg-[#080d1c] md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="text-xl font-extrabold">
            <span className="bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
              ProofPocket
            </span>
            <span className="text-blue-500">.</span>
          </Link>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            © 2026 ProofPocket. All rights reserved.
          </p>
          <div className="flex gap-5 text-sm text-slate-500 dark:text-slate-400">
            <Link href="/login" className="transition hover:text-blue-500">
              Login
            </Link>
            <Link href="/signup" className="transition hover:text-blue-500">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
