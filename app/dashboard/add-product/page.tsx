
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../lib/supabase";

export default function AddProductPage() {
  const router = useRouter();

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [price, setPrice] = useState("");
  const [warrantyMonths, setWarrantyMonths] = useState("");
  const [storeName, setStoreName] = useState("");
  const [receiptNotes, setReceiptNotes] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200";

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 focus:-translate-y-0.5 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-blue-400 dark:focus:ring-blue-950";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const months = Number(warrantyMonths);
    const priceValue = price === "" ? null : Number(price);

    if (!Number.isInteger(months) || months < 0) {
      setError("Please enter a valid warranty duration.");
      return;
    }

    if (
      priceValue !== null &&
      (!Number.isFinite(priceValue) || priceValue < 0)
    ) {
      setError("Please enter a valid price.");
      return;
    }

    const purchase = new Date(`${purchaseDate}T12:00:00`);

    if (!purchaseDate || Number.isNaN(purchase.getTime())) {
      setError("Please enter a valid purchase date.");
      return;
    }

    if (receiptFile) {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
      ];

      if (!allowedTypes.includes(receiptFile.type)) {
        setError("Only PDF, JPG, JPEG and PNG receipts are allowed.");
        return;
      }

      if (receiptFile.size > 10 * 1024 * 1024) {
        setError("Receipt file must be smaller than 10 MB.");
        return;
      }
    }

    const expiry = new Date(purchase);
    expiry.setMonth(expiry.getMonth() + months);

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    setLoading(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Please sign in again to add a product.");
        return;
      }

      // Get subscription plan and developer status
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("plan, is_developer")
        .eq("user_id", user.id)
        .single();

      if (profileError || !profile) {
        setError("Unable to verify your account. Please try again.");
        return;
      }

      // Only normal Free users have a 10-product limit
      const isDeveloper = profile.is_developer === true;
      const isFreeUser =
        profile.plan === "free" && !isDeveloper;

      if (isFreeUser) {
        const { count, error: countError } = await supabase
          .from("products")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);

        if (countError) {
          setError("Unable to check your product limit. Please try again.");
          return;
        }

        if ((count ?? 0) >= 10) {
          setError(
            "You have reached your Free Plan limit of 10 products. Visit Pricing Plans to learn about Pro."
          );
          return;
        }
      }

      let receiptPath: string | null = null;

      if (receiptFile) {
        const safeFileName = receiptFile.name.replace(
          /[^a-zA-Z0-9._-]/g,
          "_"
        );

        receiptPath = `${user.id}/${crypto.randomUUID()}-${safeFileName}`;

        const { error: uploadError } = await supabase.storage
          .from("Receipts")
          .upload(receiptPath, receiptFile, {
            contentType: receiptFile.type,
            upsert: false,
          });

        if (uploadError) {
          setError(`Receipt upload failed: ${uploadError.message}`);
          return;
        }
      }

      const { error: insertError } = await supabase
        .from("products")
        .insert({
          user_id: user.id,
          product_name: productName.trim(),
          category,
          purchase_date: formatDate(purchase),
          price: priceValue,
          warranty_months: months,
          warranty_expiry: formatDate(expiry),
          store_name: storeName.trim() || null,
          receipt_notes: receiptNotes.trim() || null,
          receipt_path: receiptPath,
        });

      if (insertError) {
        if (receiptPath) {
          await supabase.storage
            .from("Receipts")
            .remove([receiptPath]);
        }

        if (insertError.message.includes("FREE_PLAN_LIMIT_REACHED")) {
          setError(
            "You have reached your Free Plan limit of 10 products. Visit Pricing Plans to learn about Pro."
          );
        } else {
          setError(insertError.message);
        }

        return;
      }

      router.push("/dashboard/products");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 sm:px-6 sm:py-12">
      {/* Animated Background */}
      <div className="animate-login-bg pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="animate-login-bg pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition-all duration-300 hover:-translate-x-1 hover:text-indigo-600 dark:text-blue-400"
        >
          ← Back to Dashboard
        </Link>

        {/* Main Card */}
        <div className="animate-login-card mt-6 rounded-3xl border border-white/70 bg-white/90 p-6 shadow-2xl shadow-blue-900/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/90 sm:p-9">
          {/* Header */}
          <div className="border-b border-slate-200 pb-6 dark:border-slate-700">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl text-white shadow-lg shadow-blue-600/20">
              +
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Product Management
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Add New Product
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-300">
              Save your purchase details, manage warranties and keep your
              receipts organized in one place.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-7">
            {/* Product Information */}
            <section>
              <div className="mb-5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Product Information
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Enter the basic details of your product.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Product Name *</label>
                  <input
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Dell Laptop"
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`${inputClass} dark:[color-scheme:dark]`}
                  >
                    <option>Electronics</option>
                    <option>Mobile</option>
                    <option>Appliances</option>
                    <option>Furniture</option>
                    <option>Fitness</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Purchase Date *</label>
                  <input
                    type="date"
                    required
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className={`${inputClass} dark:[color-scheme:dark]`}
                  />
                </div>

                <div>
                  <label className={labelClass}>Price</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* Warranty Details */}
            <section className="border-t border-slate-200 pt-6 dark:border-slate-700">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Warranty Details
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Add the warranty period for automatic expiry tracking.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    Warranty Duration (Months) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={warrantyMonths}
                    onChange={(e) => setWarrantyMonths(e.target.value)}
                    placeholder="e.g. 12"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Store Name</label>
                  <input
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Where did you buy it?"
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* Receipt Details */}
            <section className="border-t border-slate-200 pt-6 dark:border-slate-700">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Purchase Receipt
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Keep your purchase proof safely stored.
                </p>
              </div>

              <div>
                <label className={labelClass}>Receipt Notes</label>
                <textarea
                  value={receiptNotes}
                  onChange={(e) => setReceiptNotes(e.target.value)}
                  placeholder="Additional purchase details..."
                  rows={3}
                  className={`${inputClass} resize-y`}
                />
              </div>

              <div className="mt-5">
                <label className={labelClass}>
                  Upload Purchase Receipt (Optional)
                </label>

                <label className="group mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/60 px-5 py-8 text-center transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800/60 dark:hover:border-blue-400 dark:hover:bg-slate-800">
                  <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl text-blue-700 transition-transform duration-300 group-hover:scale-110 dark:bg-blue-950 dark:text-blue-300">
                    ↑
                  </span>

                  <span className="text-sm font-bold text-slate-800 dark:text-white">
                    Click to upload your receipt
                  </span>

                  <span className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    PDF, JPG, JPEG or PNG · Maximum 10 MB
                  </span>

                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                    onChange={(e) =>
                      setReceiptFile(e.target.files?.[0] ?? null)
                    }
                    className="sr-only"
                  />
                </label>

                {receiptFile && (
                  <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/40">
                    <p className="min-w-0 break-all text-sm font-medium text-green-700 dark:text-green-300">
                      ✓ {receiptFile.name}
                    </p>

                    <button
                      type="button"
                      onClick={() => setReceiptFile(null)}
                      className="shrink-0 text-xs font-bold text-red-600 hover:underline dark:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
                <p>{error}</p>

                {error.includes("Free Plan limit") && (
                  <Link
                    href="/dashboard/pricing"
                    className="mt-3 inline-flex font-bold text-blue-700 underline dark:text-blue-400"
                  >
                    View Pricing Plans →
                  </Link>
                )}
              </div>
            )}

            {/* Submit */}
            <div className="border-t border-slate-200 pt-6 dark:border-slate-700">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 px-5 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-600/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Saving Product..." : "Save Product"}
              </button>

              <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                Your product details will be saved securely.
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
