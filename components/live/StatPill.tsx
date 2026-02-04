// components/live/StatPill.tsx
export function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-1 rounded-full bg-white/15 text-white text-xs">
      <span className="opacity-80">{label}</span>
      <span className="ml-1 font-semibold">{value}</span>
    </div>
  );
}
