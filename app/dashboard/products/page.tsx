
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase";

type Product = {
  id: string;
  product_name: string;
  category: string;
  purchase_date: string;
  price: number | null;
  warranty_months: number;
  warranty_expiry: string;
  store_name: string | null;
  receipt_path: string | null;
};

type ProductForm = {
  product_name: string;
  category: string;
  purchase_date: string;
  price: string;
  warranty_months: string;
  store_name: string;
};

function getWarrantyStatus(expiryDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(`${expiryDate}T00:00:00`);
  const daysLeft = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysLeft < 0) {
    return {
      label: "Expired",
      color: "bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-300",
    };
  }

  if (daysLeft <= 30) {
    return {
      label: "Expiring Soon",
      color:
        "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300",
    };
  }

  return {
    label: "Active",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300",
  };
}

function calculateWarrantyExpiry(purchaseDate: string, months: number) {
  const [year, month, day] = purchaseDate.split("-").map(Number);

  const targetMonth = month - 1 + months;
  const targetYear = year + Math.floor(targetMonth / 12);
  const finalMonth = targetMonth % 12;

  const lastDay = new Date(targetYear, finalMonth + 1, 0).getDate();
  const finalDay = Math.min(day, lastDay);

  const date = new Date(targetYear, finalMonth, finalDay);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

function getCategoryIcon(category: string) {
  const icons: Record<string, string> = {
    Electronics: "💻",
    Mobile: "📱",
    Appliances: "🏠",
    Furniture: "🪑",
    Fitness: "🏋️",
    Other: "📦",
  };

  return icons[category] || "📦";
}

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-300 focus:-translate-y-0.5 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400 dark:focus:border-blue-400 dark:focus:ring-blue-950";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [form, setForm] = useState<ProductForm>({
    product_name: "",
    category: "",
    purchase_date: "",
    price: "",
    warranty_months: "",
    store_name: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [editReceiptFile, setEditReceiptFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [receiptLoadingId, setReceiptLoadingId] = useState<string | null>(
    null
  );

  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadProducts() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setProducts((data ?? []) as Product[]);
      }

      setLoading(false);
    }

    loadProducts();
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(products.map((product) => product.category))),
  ];

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      product.product_name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      (product.store_name ?? "").toLowerCase().includes(query);

    const matchesCategory =
      categoryFilter === "All" || product.category === categoryFilter;

    const matchesStatus =
      statusFilter === "All" ||
      getWarrantyStatus(product.warranty_expiry).label === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  function startEditing(product: Product) {
    setEditingProduct(product);

    setForm({
      product_name: product.product_name,
      category: product.category,
      purchase_date: product.purchase_date,
      price: product.price === null ? "" : String(product.price),
      warranty_months: String(product.warranty_months),
      store_name: product.store_name ?? "",
    });

    setEditReceiptFile(null);
    setActionError("");
    setSuccessMessage("");
  }

  function cancelEditing() {
    setEditingProduct(null);
    setEditReceiptFile(null);
    setActionError("");
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingProduct) return;

    const months = Number(form.warranty_months);
    const priceValue = form.price === "" ? null : Number(form.price);

    if (
      !form.product_name.trim() ||
      !form.category.trim() ||
      !form.purchase_date ||
      !Number.isInteger(months) ||
      months < 1
    ) {
      setActionError("Please enter valid product information.");
      return;
    }

    const purchase = new Date(`${form.purchase_date}T12:00:00`);

    if (Number.isNaN(purchase.getTime())) {
      setActionError("Please enter a valid purchase date.");
      return;
    }

    if (
      priceValue !== null &&
      (!Number.isFinite(priceValue) || priceValue < 0)
    ) {
      setActionError("Please enter a valid price.");
      return;
    }

    if (editReceiptFile) {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
      ];

      if (!allowedTypes.includes(editReceiptFile.type)) {
        setActionError("Only PDF, JPG, JPEG and PNG files are allowed.");
        return;
      }

      if (editReceiptFile.size > 10 * 1024 * 1024) {
        setActionError("Receipt file must be smaller than 10MB.");
        return;
      }
    }

    setSaving(true);
    setActionError("");
    setSuccessMessage("");

    const supabase = createClient();

    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData.user) {
      setActionError("Your session has expired. Please log in again.");
      setSaving(false);
      return;
    }

    const warrantyExpiry = calculateWarrantyExpiry(
      form.purchase_date,
      months
    );

    let newReceiptPath: string | null = editingProduct.receipt_path;

    if (editReceiptFile) {
      const safeFileName = editReceiptFile.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      );

      const filePath = `${userData.user.id}/${crypto.randomUUID()}-${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("Receipts")
        .upload(filePath, editReceiptFile, {
          contentType: editReceiptFile.type,
          upsert: false,
        });

      if (uploadError) {
        setActionError(uploadError.message);
        setSaving(false);
        return;
      }

      newReceiptPath = filePath;
    }

    const { data, error } = await supabase
      .from("products")
      .update({
        product_name: form.product_name.trim(),
        category: form.category.trim(),
        purchase_date: form.purchase_date,
        price: priceValue,
        warranty_months: months,
        warranty_expiry: warrantyExpiry,
        store_name: form.store_name.trim() || null,
        receipt_path: newReceiptPath,
      })
      .eq("id", editingProduct.id)
      .select()
      .single();

    if (error) {
      if (
        editReceiptFile &&
        newReceiptPath &&
        newReceiptPath !== editingProduct.receipt_path
      ) {
        await supabase.storage.from("Receipts").remove([newReceiptPath]);
      }

      setActionError(error.message);
      setSaving(false);
      return;
    }

    let message = "Product updated successfully!";

    if (
      editReceiptFile &&
      editingProduct.receipt_path &&
      editingProduct.receipt_path !== newReceiptPath
    ) {
      const { error: removeError } = await supabase.storage
        .from("Receipts")
        .remove([editingProduct.receipt_path]);

      if (removeError) {
        message =
          "Product updated, but the old receipt could not be removed.";
      }
    }

    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === editingProduct.id ? (data as Product) : product
      )
    );

    setEditingProduct(null);
    setEditReceiptFile(null);
    setSuccessMessage(message);
    setSaving(false);
  }

  async function handleViewReceipt(product: Product) {
    if (!product.receipt_path) return;

    setReceiptLoadingId(product.id);
    setActionError("");
    setSuccessMessage("");

    const receiptWindow = window.open("about:blank", "_blank");

    if (!receiptWindow) {
      setActionError(
        "Your browser blocked the new tab. Please allow pop-ups and try again."
      );
      setReceiptLoadingId(null);
      return;
    }

    const supabase = createClient();

    const { data, error } = await supabase.storage
      .from("Receipts")
      .createSignedUrl(product.receipt_path, 60);

    if (error || !data?.signedUrl) {
      receiptWindow.close();
      setActionError(error?.message || "Could not open the receipt.");
      setReceiptLoadingId(null);
      return;
    }

    receiptWindow.location.href = data.signedUrl;
    setReceiptLoadingId(null);
  }

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.product_name}"?`
    );

    if (!confirmed) return;

    setDeletingId(product.id);
    setActionError("");
    setSuccessMessage("");

    const supabase = createClient();

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      setActionError(error.message);
      setDeletingId(null);
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.filter((item) => item.id !== product.id)
    );

    if (editingProduct?.id === product.id) {
      setEditingProduct(null);
      setEditReceiptFile(null);
    }

    if (product.receipt_path) {
      const { error: receiptError } = await supabase.storage
        .from("Receipts")
        .remove([product.receipt_path]);

      if (receiptError) {
        setSuccessMessage(
          "Product deleted, but its receipt could not be removed from storage."
        );
      } else {
        setSuccessMessage("Product and receipt deleted successfully!");
      }
    } else {
      setSuccessMessage("Product deleted successfully!");
    }

    setDeletingId(null);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 sm:px-6 sm:py-12">

      {/* Animated Background */}
      <div className="animate-login-bg pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="animate-login-bg pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-purple-500/15 blur-3xl" />

      <div className="animate-login-bg pointer-events-none absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

      {/* Background Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)",
          backgroundSize: "35px 35px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* Header */}
        <div className="animate-login-card flex flex-wrap items-center justify-between gap-5 rounded-3xl border border-white/70 bg-white/75 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/75 sm:p-8">

          <div>
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-blue-700 transition hover:text-indigo-600 hover:underline dark:text-blue-400"
            >
              ← Back to Dashboard
            </Link>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Your Collection
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              My Products
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-300">
              Manage your saved products, track warranties and keep your
              purchase receipts organized.
            </p>
          </div>

          <Link
            href="/dashboard/add-product"
            className="rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            + Add Product
          </Link>
        </div>

        {/* Messages */}
        {successMessage && (
          <p className="animate-login-card mt-6 rounded-xl border border-green-200 bg-green-50/90 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/70 dark:text-green-300">
            {successMessage}
          </p>
        )}

        {actionError && (
          <p className="animate-login-card mt-6 rounded-xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/70 dark:text-red-300">
            {actionError}
          </p>
        )}

        {/* Search and Filters */}
        {!loading && !error && products.length > 0 && (
          <div className="animate-login-card mt-8 rounded-3xl border border-white/70 bg-white/75 p-5 shadow-xl shadow-blue-900/5 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/75 sm:p-6">

            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Find Your Products
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Search and filter your saved products.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Search Products
                </label>

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search product or store..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-950"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Category
                </label>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:[color-scheme:dark]"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Warranty Status
                </label>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:[color-scheme:dark]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Expiring Soon">Expiring Soon</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing{" "}
                <strong className="text-slate-900 dark:text-white">
                  {filteredProducts.length}
                </strong>{" "}
                of {products.length} products
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("All");
                  setStatusFilter("All");
                }}
                className="text-sm font-bold text-blue-700 transition hover:text-indigo-600 hover:underline dark:text-blue-400"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="mt-10 rounded-3xl border border-white/70 bg-white/75 p-12 text-center shadow-lg backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/75">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700 dark:border-slate-700 dark:border-t-blue-400" />
            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-300">
              Loading your products...
            </p>
          </div>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50/90 p-6 text-red-600 dark:border-red-900 dark:bg-red-950/70 dark:text-red-300">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="animate-login-card mt-10 rounded-3xl border border-white/70 bg-white/80 p-10 text-center shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/80">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-4xl dark:bg-blue-950">
              📦
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
              No Products Yet
            </h2>

            <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">
              Add your first product to start tracking its warranty.
            </p>

            <Link
              href="/dashboard/add-product"
              className="mt-6 inline-block rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-1"
            >
              + Add Your First Product
            </Link>
          </div>
        ) : (
          <>

            {/* Edit Product Form */}
            {editingProduct && (
              <form
                onSubmit={handleUpdate}
                className="animate-login-card mt-8 rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/90 sm:p-8"
              >
                <div className="mb-6 border-b border-slate-200 pb-5 dark:border-slate-700">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                    Product Management
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                    Edit Product
                  </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Product Name
                    <input
                      type="text"
                      required
                      value={form.product_name}
                      onChange={(e) =>
                        setForm({ ...form, product_name: e.target.value })
                      }
                      className={inputClass}
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Category
                    <input
                      type="text"
                      required
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      className={inputClass}
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Purchase Date
                    <input
                      type="date"
                      required
                      value={form.purchase_date}
                      onChange={(e) =>
                        setForm({ ...form, purchase_date: e.target.value })
                      }
                      className={`${inputClass} dark:[color-scheme:dark]`}
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Price
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      placeholder="Enter price"
                      className={inputClass}
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Warranty (Months)
                    <input
                      type="number"
                      min="1"
                      required
                      value={form.warranty_months}
                      onChange={(e) =>
                        setForm({ ...form, warranty_months: e.target.value })
                      }
                      className={inputClass}
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Store Name
                    <input
                      type="text"
                      value={form.store_name}
                      onChange={(e) =>
                        setForm({ ...form, store_name: e.target.value })
                      }
                      placeholder="Enter store name"
                      className={inputClass}
                    />
                  </label>
                </div>

                <div className="mt-6">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Replace Receipt (Optional)
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                      onChange={(e) =>
                        setEditReceiptFile(e.target.files?.[0] ?? null)
                      }
                      className={`${inputClass} file:mr-4 file:rounded-lg file:border-0 file:bg-blue-100 file:px-3 file:py-2 file:font-semibold file:text-blue-700 dark:file:bg-blue-950 dark:file:text-blue-300`}
                    />
                  </label>

                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    PDF, JPG, JPEG or PNG. Maximum size: 10MB.
                  </p>

                  {editReceiptFile && (
                    <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
                      Selected: {editReceiptFile.name}
                    </p>
                  )}

                  {editingProduct.receipt_path && !editReceiptFile && (
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Current receipt is saved. Select a new file only if you
                      want to replace it.
                    </p>
                  )}
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={saving}
                    className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* No Filter Results */}
            {filteredProducts.length === 0 ? (
              <div className="mt-8 rounded-3xl border border-white/70 bg-white/80 p-10 text-center shadow-lg backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/80">
                <div className="text-4xl">🔎</div>

                <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                  No Matching Products
                </h2>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("All");
                    setStatusFilter("All");
                  }}
                  className="mt-5 font-semibold text-blue-700 hover:underline dark:text-blue-400"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => {
                  const status = getWarrantyStatus(product.warranty_expiry);

                  return (
                    <div
                      key={product.id}
                      className="group animate-login-card rounded-3xl border border-white/70 bg-white/85 p-6 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/10 dark:border-slate-700 dark:bg-slate-900/85 dark:hover:border-blue-800"
                    >

                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-2xl transition-transform duration-300 group-hover:scale-110 dark:from-blue-950 dark:to-indigo-950">
                            {getCategoryIcon(product.category)}
                          </div>

                          <div className="min-w-0">
                            <h2 className="break-words text-lg font-bold text-slate-900 dark:text-white">
                              {product.product_name}
                            </h2>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {product.category}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      {/* Product Details */}
                      <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm dark:border-slate-700">

                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500 dark:text-slate-400">
                            Purchase Date
                          </span>
                          <span className="text-right font-semibold text-slate-800 dark:text-slate-200">
                            {product.purchase_date}
                          </span>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500 dark:text-slate-400">
                            Warranty
                          </span>
                          <span className="text-right font-semibold text-slate-800 dark:text-slate-200">
                            {product.warranty_months} months
                          </span>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500 dark:text-slate-400">
                            Expiry Date
                          </span>
                          <span className="text-right font-semibold text-slate-800 dark:text-slate-200">
                            {product.warranty_expiry}
                          </span>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500 dark:text-slate-400">
                            Price
                          </span>
                          <span className="text-right font-semibold text-slate-800 dark:text-slate-200">
                            {product.price === null
                              ? "Not provided"
                              : product.price.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500 dark:text-slate-400">
                            Store
                          </span>
                          <span className="max-w-[55%] break-words text-right font-semibold text-slate-800 dark:text-slate-200">
                            {product.store_name || "Not provided"}
                          </span>
                        </div>
                      </div>

                      {/* Receipt */}
                      {product.receipt_path ? (
                        <button
                          type="button"
                          onClick={() => handleViewReceipt(product)}
                          disabled={receiptLoadingId === product.id}
                          className="mt-6 w-full rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm font-bold text-purple-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-purple-900 dark:bg-purple-950/60 dark:text-purple-300 dark:hover:bg-purple-900"
                        >
                          {receiptLoadingId === product.id
                            ? "Opening Receipt..."
                            : "View Receipt"}
                        </button>
                      ) : (
                        <p className="mt-6 rounded-xl bg-slate-100 px-4 py-3 text-center text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          No receipt uploaded
                        </p>
                      )}

                      {/* Actions */}
                      <div className="mt-5 flex gap-3 border-t border-slate-200 pt-5 dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => startEditing(product)}
                          className="flex-1 rounded-xl bg-blue-100 px-4 py-3 text-sm font-bold text-blue-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product.id}
                          className="flex-1 rounded-xl bg-red-100 px-4 py-3 text-sm font-bold text-red-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
                        >
                          {deletingId === product.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
