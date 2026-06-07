// ==========================================
// EXTRA PACK - Custom Hooks
// ==========================================
import { useState, useEffect, useCallback } from "react";
import { Product, Wilaya } from "@/types";

// ── useProducts ───────────────────────────────────────────
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      } else {
        setError("Erreur lors du chargement des produits");
      }
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}

// ── useDeliveryZones ──────────────────────────────────────
export function useDeliveryZones() {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchZones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/delivery");
      const data = await res.json();
      if (data.success) {
        setWilayas(data.wilayas);
      }
    } catch {
      setError("Erreur chargement zones de livraison");
    } finally {
      setLoading(false);
    }
  }, []);

  return { wilayas, loading, error, fetchZones };
}

// ── useProduct (single) ───────────────────────────────────
export function useProduct(id: string) {
  const { products, loading } = useProducts();
  const product = products.find((p) => p.id === id);
  return { product, loading };
}

// ── useIntersectionObserver (for animations) ──────────────
export function useIntersectionObserver(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<Element | null>(null);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return { ref: setRef, isVisible };
}

// ── useWindowSize ─────────────────────────────────────────
export function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return { ...size, isMobile: size.width < 640, isTablet: size.width < 1024 };
}

// ── useDebounce ───────────────────────────────────────────
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
