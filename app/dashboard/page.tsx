
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase";

type Counts = {
  total: number;
  active: number;
  expiring: number;
  expired: number;
};

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [error, setError] = useState("");
  const [counts, setCounts] = useState<Counts>({
    total: 0,
    active: 0,
    expiring: 0,
    expired: 0,
  });

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select("warranty_expiry");

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let active = 0;
      let expiring = 0;
      let expired = 0;

      for (const product of data ?? []) {
        const expiry = new Date(`${product.warranty_expiry}T00:00:00`);

        const daysLeft = Math.ceil(
          (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysLeft < 0) expired++;
        else if (daysLeft <= 30) expiring++;
        else active++;
      }

      setCounts({
        total: data?.length ?? 0,
        active,
        expiring,
        expired,
      });

      setLoading(false);
    }

    loadDashboard();
  }, []);

  async function handleLogout() {
    setLogoutLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
      setLogoutLoading(false);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  const percentage = (value: number) =>
    counts.total > 0 ? Math.round((value / counts.total) * 100) : 0;

  const statCards = [
    {
      label: "Total Products",
      value: counts.total,
      icon: "📦",
      color: "blue",
      description: "Products in your pocket",
    },
    {
      label: "Active Warranties",
      value: counts.active,
      icon: "🛡️",
      color: "green",
      description: "Currently protected",
    },
    {
      label: "Expiring Soon",
      value: counts.expiring,
      icon: "⏰",
      color: "amber",
      description: "Within the next 30 days",
    },
    {
      label: "Expired Warranties",
      value: counts.expired,
      icon: "⚠️",
      color: "red",
      description: "Coverage has ended",
    },
  ];

  const healthItems = [
    {
      label: "Active Warranties",
      value: counts.active,
      color: "bg-emerald-500",
      textColor: "text-emerald-500",
    },
    {
      label: "Expiring Soon",
      value: counts.expiring,
      color: "bg-amber-500",
      textColor: "text-amber-500",
    },
    {
      label: "Expired Warranties",
      value: counts.expired,
      color: "bg-red-500",
      textColor: "text-red-500",
    },
  ];

  return (
    <main className="min-h-screen min-w-0 overflow-x-hidden bg-[#f5f7ff] text-slate-900 dark:bg-[#060b18] dark:text-white">
      {/* TOP NAVIGATION */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1223]/90">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-3 px-3 py-3 sm:px-5 sm:py-4 md:px-8">
          <Link href="/" className="shrink-0 text-xl font-extrabold tracking-tight sm:text-2xl">
            <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
              ProofPocket
            </span>
            <span className="text-blue-500">.</span>
          </Link>

          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <span className="hidden rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 sm:inline-flex">
              ● Account Active
            </span>

            <button
              type="button"
              onClick={handleLogout}
              disabled={logoutLoading}
              className="shrink-0 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 sm:px-4 sm:py-2.5 sm:text-sm"
            >
              {logoutLoading ? "Logging out..." : "Logout ↗"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1500px] min-w-0 grid-cols-1 gap-5 px-3 py-4 sm:gap-7 sm:px-5 sm:py-6 md:px-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
        {/* SIDEBAR */}
        <aside className="h-fit min-w-0 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm dark:border-white/10 dark:bg-[#10182b] sm:rounded-3xl sm:p-4 lg:sticky lg:top-24">
          <p className="hidden px-3 pb-3 pt-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 lg:block">
            Workspace
          </p>

          <nav className="grid grid-cols-2 gap-2 min-[480px]:grid-cols-4 lg:grid-cols-1 lg:gap-2">
            <Link
              href="/dashboard"
              className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-1.5 py-3 text-center text-[11px] font-bold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110 sm:text-xs lg:flex-row lg:justify-start lg:gap-3 lg:px-4 lg:py-3.5 lg:text-sm lg:text-left"
            >
              <span className="text-lg sm:text-xl lg:text-base">▦</span>
              <span>Dashboard</span>
            </Link>

            <Link
              href="/dashboard/products"
              className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-3 text-center text-[11px] font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-blue-400 sm:text-xs lg:flex-row lg:justify-start lg:gap-3 lg:px-4 lg:py-3.5 lg:text-sm lg:text-left"
            >
              <span className="text-lg sm:text-xl lg:text-base">📦</span>
              <span>My Products</span>
            </Link>

            <Link
              href="/dashboard/add-product"
              className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-3 text-center text-[11px] font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-blue-400 sm:text-xs lg:flex-row lg:justify-start lg:gap-3 lg:px-4 lg:py-3.5 lg:text-sm lg:text-left"
            >
              <span className="text-lg sm:text-xl lg:text-base">＋</span>
              <span>Add Product</span>
            </Link>

            <Link
              href="/dashboard/pricing"
              className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-3 text-center text-[11px] font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-blue-400 sm:text-xs lg:flex-row lg:justify-start lg:gap-3 lg:px-4 lg:py-3.5 lg:text-sm lg:text-left"
            >
              <span className="text-lg sm:text-xl lg:text-base">💎</span>
              <span>Pricing Plans</span>
            </Link>
          </nav>

          <div className="mt-8 hidden rounded-2xl bg-gradient-to-br from-blue-600 to-violet-700 p-5 text-white lg:block">
            <div className="text-2xl">🛡️</div>
            <h3 className="mt-3 font-bold">Your Pocket, Protected.</h3>
            <p className="mt-2 text-xs leading-6 text-blue-100">
              Keep your purchase information organized and accessible.
            </p>
            <Link
              href="/dashboard/add-product"
              className="mt-4 inline-flex rounded-lg bg-white/15 px-3 py-2 text-xs font-bold transition hover:bg-white/25"
            >
              Add a Product →
            </Link>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="min-w-0">
          {/* WELCOME BANNER */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#155eef] via-[#4056d9] to-[#7044c8] p-5 text-white shadow-xl shadow-blue-900/15 sm:rounded-3xl sm:p-7 md:p-9">
            <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 right-1/3 h-64 w-64 rounded-full bg-violet-300/20 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-5 sm:gap-7 sm:flex-row sm:items-center">
              <div className="min-w-0">
                <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-blue-50 sm:text-xs">
                  YOUR PERSONAL WORKSPACE
                </span>

                <h1 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight sm:mt-5 sm:text-3xl md:text-4xl">
                  Welcome to Your Dashboard
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:leading-7 md:text-base">
                  Everything about your purchases, receipts and warranties,
                  all organized in one place.
                </p>
              </div>

              <Link
                href="/dashboard/add-product"
                className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-extrabold text-blue-700 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-blue-50 sm:w-fit"
              >
                ＋ Add Product
              </Link>
            </div>

            <div className="relative mt-6 flex flex-wrap gap-x-5 gap-y-3 border-t border-white/20 pt-5 text-xs text-blue-100 sm:mt-8 sm:gap-6 sm:text-sm">
              <span>📁 Digital Receipt Vault</span>
              <span>🛡️ Warranty Tracking</span>
              <span>⏰ Expiry Monitoring</span>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mt-5 break-words rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </div>
          )}

          {/* STATISTICS HEADING */}
          <div className="mt-7 flex flex-wrap items-end justify-between gap-2 sm:mt-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                Overview
              </p>
              <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">
                Your Statistics
              </h2>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 sm:text-xs">
              Live account data
            </span>
          </div>

          {/* STATISTICS CARDS */}
          <div className="mt-5 grid grid-cols-1 min-[380px]:grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className="dashboard-card group min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5 sm:p-5 dark:border-white/10 dark:bg-[#10182b] dark:hover:shadow-black/20"
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl sm:h-12 sm:w-12 sm:rounded-2xl sm:text-2xl ${
                      stat.color === "blue"
                        ? "bg-blue-100 dark:bg-blue-500/15"
                        : stat.color === "green"
                          ? "bg-emerald-100 dark:bg-emerald-500/15"
                          : stat.color === "amber"
                            ? "bg-amber-100 dark:bg-amber-500/15"
                            : "bg-red-100 dark:bg-red-500/15"
                    }`}
                  >
                    {stat.icon}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 sm:text-xs">
                    {loading ? "..." : "LIVE"}
                  </span>
                </div>

                <p className="mt-4 break-words text-xs font-medium text-slate-500 dark:text-slate-400 sm:mt-5 sm:text-sm">
                  {stat.label}
                </p>

                <h3 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {loading ? "—" : stat.value}
                </h3>

                <p className="mt-1 min-h-8 text-[11px] leading-5 text-slate-400 sm:text-xs">
                  {stat.description}
                </p>

                <div
                  className={`mt-3 h-1.5 overflow-hidden rounded-full ${
                    stat.color === "blue"
                      ? "bg-blue-100 dark:bg-blue-500/10"
                      : stat.color === "green"
                        ? "bg-emerald-100 dark:bg-emerald-500/10"
                        : stat.color === "amber"
                          ? "bg-amber-100 dark:bg-amber-500/10"
                          : "bg-red-100 dark:bg-red-500/10"
                  }`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      stat.color === "blue"
                        ? "bg-blue-500"
                        : stat.color === "green"
                          ? "bg-emerald-500"
                          : stat.color === "amber"
                            ? "bg-amber-500"
                            : "bg-red-500"
                    }`}
                    style={{
                      width: loading ? "0%" : `${percentage(stat.value)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* LOWER DASHBOARD PANELS */}
          <div className="mt-6 grid min-w-0 gap-5 sm:mt-8 sm:gap-6 xl:grid-cols-2">
            {/* WARRANTY HEALTH */}
            <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 md:p-7 dark:border-white/10 dark:bg-[#10182b]">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 sm:text-xs dark:text-blue-400">
                    Protection Report
                  </p>
                  <h2 className="mt-2 text-lg font-extrabold sm:text-xl">
                    Warranty Health
                  </h2>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl sm:h-11 sm:w-11 dark:bg-blue-500/10">
                  📊
                </div>
              </div>

              <div className="mt-6 sm:mt-7">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <p className="text-3xl font-extrabold sm:text-4xl">
                      {loading ? "—" : `${percentage(counts.active)}%`}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                      Active warranty share
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-400 sm:text-xs">
                    {loading ? "—" : counts.total} total products
                  </span>
                </div>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div className="flex h-full">
                    <div
                      className="bg-emerald-500 transition-all duration-1000"
                      style={{ width: loading ? "0%" : `${percentage(counts.active)}%` }}
                    />
                    <div
                      className="bg-amber-500 transition-all duration-1000"
                      style={{ width: loading ? "0%" : `${percentage(counts.expiring)}%` }}
                    />
                    <div
                      className="bg-red-500 transition-all duration-1000"
                      style={{ width: loading ? "0%" : `${percentage(counts.expired)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  {healthItems.map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.color}`} />
                          <span className="text-xs font-medium text-slate-600 sm:text-sm dark:text-slate-300">
                            {item.label}
                          </span>
                        </div>
                        <span className={`text-sm font-extrabold ${item.textColor}`}>
                          {loading ? "—" : item.value}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${item.color}`}
                          style={{
                            width: loading ? "0%" : `${percentage(item.value)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 md:p-7 dark:border-white/10 dark:bg-[#10182b]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-violet-600 sm:text-xs dark:text-violet-400">
                Get Things Done
              </p>
              <h2 className="mt-2 text-lg font-extrabold sm:text-xl">
                Quick Actions
              </h2>
              <p className="mt-2 text-xs leading-6 text-slate-500 sm:text-sm dark:text-slate-400">
                Manage your purchase records with just a few clicks.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:mt-7 sm:gap-4">
                <Link
                  href="/dashboard/add-product"
                  className="group min-w-0 rounded-2xl border border-blue-200 bg-blue-50/70 p-4 transition duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 sm:p-5 dark:border-blue-500/20 dark:bg-blue-500/5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-2xl text-white shadow-lg shadow-blue-500/20 transition group-hover:scale-110">
                    ＋
                  </div>
                  <h3 className="mt-4 font-extrabold">Add Product</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Save a new purchase and its warranty details.
                  </p>
                  <p className="mt-3 text-sm font-bold text-blue-600 dark:text-blue-400">
                    Add Now →
                  </p>
                </Link>

                <Link
                  href="/dashboard/products"
                  className="group min-w-0 rounded-2xl border border-violet-200 bg-violet-50/70 p-4 transition duration-300 hover:-translate-y-1 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/10 sm:p-5 dark:border-violet-500/20 dark:bg-violet-500/5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-2xl text-white shadow-lg shadow-violet-500/20 transition group-hover:scale-110">
                    📦
                  </div>
                  <h3 className="mt-4 font-extrabold">View Products</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Browse, edit and manage your saved products.
                  </p>
                  <p className="mt-3 text-sm font-bold text-violet-600 dark:text-violet-400">
                    Explore →
                  </p>
                </Link>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-3 sm:mt-5 sm:p-4 dark:bg-white/[0.04]">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold">Stay organized</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Keep your purchase receipts safe and your warranty
                      information up to date.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-7 flex flex-col items-center justify-between gap-2 border-t border-slate-200 py-6 text-center sm:mt-8 sm:flex-row sm:text-left dark:border-white/10">
            <p className="text-[11px] text-slate-500 sm:text-xs dark:text-slate-400">
              © 2026 ProofPocket. Your purchases, your protection.
            </p>
            <p className="text-[11px] text-slate-400 sm:text-xs">
              Personal Warranty Organizer
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
