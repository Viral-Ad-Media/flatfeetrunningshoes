export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" aria-hidden className="h-8 w-8 shrink-0">
        <circle cx="16" cy="16" r="16" className="fill-navy" />
        <path
          d="M10 22c0-5 2-11 6-13 3-1.5 6 .5 6 3.5 0 2.5-2 3.5-3.5 4.5-1.6 1-2.5 2.5-2.5 5H10z"
          className="fill-white"
        />
        <circle cx="21.5" cy="21.5" r="2.2" className="fill-coral" />
      </svg>
      <span className="leading-none">
        <span className="block text-[15px] font-extrabold tracking-tight text-navy">FlatFeet</span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Running Shoes</span>
      </span>
    </span>
  );
}
