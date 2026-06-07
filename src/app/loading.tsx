// ==========================================
// EXTRA PACK - Loading UI
// ==========================================
export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--bg-primary)] z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-4 border-brand-100 dark:border-brand-900/30 border-t-brand-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg">🌸</span>
          </div>
        </div>
        <span className="font-display font-semibold text-gradient text-sm tracking-widest uppercase">
          Extra Pack
        </span>
      </div>
    </div>
  );
}
