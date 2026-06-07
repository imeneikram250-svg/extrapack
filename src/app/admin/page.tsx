"use client";
// ==========================================
// EXTRA PACK - Panneau Administrateur
// ==========================================
import { useState, useEffect } from "react";
import { Order, OrderStatus, AdminStats } from "@/types";
import { formatPrice, formatDate, getStatusColor, getStatusIcon } from "@/lib/utils";
import {
  FiPackage, FiDollarSign, FiTrendingUp, FiAlertTriangle,
  FiSearch, FiRefreshCw, FiLogOut, FiFilter, FiCheck, FiEye
} from "react-icons/fi";
import { motion } from "framer-motion";

const STATUSES: OrderStatus[] = [
  "NOUVELLE COMMANDE", "CONFIRMÉE", "EN PRÉPARATION",
  "EXPÉDIÉE", "LIVRÉE", "RETOURNÉE", "ANNULÉE"
];

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [adminToken, setAdminToken] = useState("");

  const [tab, setTab] = useState<"dashboard" | "orders">("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Partial<AdminStats>>({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminToken(password);
    setAuthenticated(true); // Will be validated on first API call
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, statsRes] = await Promise.all([
        fetch("/api/orders", { headers: { "x-admin-token": adminToken } }),
        fetch("/api/admin/stats", { headers: { "x-admin-token": adminToken } }),
      ]);

      if (ordersRes.status === 401) {
        setAuthenticated(false);
        setAuthError(true);
        return;
      }

      const ordersData = await ordersRes.json();
      const statsData = await statsRes.json();

      if (ordersData.success) setOrders(ordersData.orders);
      if (statsData.success) setStats(statsData.stats);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated]);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      !searchQuery ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.phone.includes(searchQuery);

    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── LOGIN SCREEN ───────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <span className="font-display font-bold text-3xl text-gradient">EXTRA PACK</span>
            <p className="text-gray-400 mt-2 text-sm">Panneau administrateur</p>
          </div>

          <div className="bg-dark-800 rounded-2xl p-6 border border-white/10">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Mot de passe admin</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  autoFocus
                />
                {authError && (
                  <p className="text-red-400 text-xs mt-1">Mot de passe incorrect</p>
                )}
              </div>
              <button
                type="submit"
                disabled={!password}
                className="w-full btn-primary py-3"
              >
                Se connecter
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── ADMIN DASHBOARD ────────────────────────────────────
  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      {/* Admin Header */}
      <header className="bg-[var(--bg-primary)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-lg text-gradient">EXTRA PACK</span>
          <span className="text-xs bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full font-medium">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors"
          >
            <FiRefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setAuthenticated(false)}
            className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-[var(--bg-primary)] border-b border-[var(--border)] px-4">
        <div className="max-w-7xl mx-auto flex gap-0">
          {(["dashboard", "orders"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t
                  ? "border-brand-500 text-brand-500"
                  : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {t === "dashboard" ? "📊 Dashboard" : "📦 Commandes"}
              {t === "orders" && stats.newOrders ? (
                <span className="ml-2 bg-brand-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {stats.newOrders}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {tab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Commandes totales", value: stats.totalOrders ?? "—", icon: <FiPackage size={20} />, color: "brand" },
                { label: "Chiffre d'affaires", value: stats.totalRevenue ? formatPrice(stats.totalRevenue) : "—", icon: <FiDollarSign size={20} />, color: "green" },
                { label: "Produits vendus", value: stats.totalProductsSold ?? "—", icon: <FiTrendingUp size={20} />, color: "blue" },
                { label: "Ruptures de stock", value: stats.outOfStockProducts ?? "—", icon: <FiAlertTriangle size={20} />, color: "orange" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card p-5"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    stat.color === "brand" ? "bg-brand-50 dark:bg-brand-900/30 text-brand-500" :
                    stat.color === "green" ? "bg-green-50 dark:bg-green-900/30 text-green-500" :
                    stat.color === "blue" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-500" :
                    "bg-orange-50 dark:bg-orange-900/30 text-orange-500"
                  }`}>
                    {stat.icon}
                  </div>
                  <p className="font-display font-bold text-2xl text-[var(--text-primary)]">{stat.value}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Order Status Breakdown */}
            <div className="card p-6">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4">Statut des commandes</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Nouvelles", value: stats.newOrders, status: "NOUVELLE COMMANDE" },
                  { label: "Confirmées", value: stats.confirmedOrders, status: "CONFIRMÉE" },
                  { label: "Expédiées", value: stats.shippedOrders, status: "EXPÉDIÉE" },
                  { label: "Livrées", value: stats.deliveredOrders, status: "LIVRÉE" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { setStatusFilter(item.status as OrderStatus); setTab("orders"); }}
                    className="p-4 rounded-xl bg-[var(--bg-secondary)] hover:border-brand-400 border border-[var(--border)] text-left transition-all"
                  >
                    <p className="font-display font-bold text-2xl text-[var(--text-primary)]">
                      {item.value ?? "—"}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">{item.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Chercher une commande, client, téléphone..."
                  className="input-field pl-9 text-sm"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "")}
                className="input-field text-sm max-w-[200px]"
              >
                <option value="">Tous les statuts</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{getStatusIcon(s)} {s}</option>
                ))}
              </select>
            </div>

            <p className="text-sm text-[var(--text-secondary)]">
              {filteredOrders.length} commande{filteredOrders.length !== 1 ? "s" : ""}
            </p>

            {/* Orders List */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <FiRefreshCw size={32} className="animate-spin text-brand-500" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-20 card">
                <span className="text-5xl block mb-3">📭</span>
                <p className="text-[var(--text-secondary)]">Aucune commande trouvée</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    layout
                    className="card p-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-[var(--text-primary)]">
                            #{order.orderNumber}
                          </span>
                          <span className={`status-badge ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)} {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {order.customer.firstName} {order.customer.lastName} · {order.customer.phone}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {order.customer.commune}, {order.customer.wilaya} · {formatDate(order.date)}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {order.items.map(i => `${i.productName} ×${i.quantity}`).join(", ")}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-display font-bold text-lg text-brand-500">
                          {formatPrice(order.total)}
                        </span>

                        <button
                          onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                          className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-secondary)]"
                        >
                          <FiEye size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded status controls */}
                    {selectedOrder?.id === order.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 pt-4 border-t border-[var(--border)]"
                      >
                        <p className="text-xs text-[var(--text-secondary)] mb-3 font-medium">
                          Modifier le statut :
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {STATUSES.map((status) => (
                            <button
                              key={status}
                              onClick={() => updateOrderStatus(order.id, status)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                                order.status === status
                                  ? "bg-brand-500 text-white"
                                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/20"
                              }`}
                            >
                              {order.status === status && <FiCheck size={10} />}
                              {getStatusIcon(status)} {status}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
