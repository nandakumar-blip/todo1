// ─────────────────────────────────────────────
//  SkeletonCard — animated loading placeholder
// ─────────────────────────────────────────────

export default function SkeletonCard() {
  const shimmer = 'skeleton-shimmer rounded';
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-[#2C3350] bg-white dark:bg-[#1E2235] p-4 shadow-sm"
      aria-hidden="true">
      {/* Priority bar */}
      <div className={`${shimmer} absolute left-0 top-0 bottom-0 w-[3px]`} />
      <div className="pl-3 flex gap-2.5 mb-3">
        {/* Checkbox */}
        <div className={`${shimmer} w-[18px] h-[18px] rounded flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <div className={`${shimmer} h-[16px] w-3/5 mb-2`} />
          <div className={`${shimmer} h-[12px] w-4/5 mb-1`} />
          <div className={`${shimmer} h-[12px] w-2/5`} />
        </div>
      </div>
      <div className="pl-3 flex items-center gap-2 flex-wrap">
        <div className={`${shimmer} h-[20px] w-[68px] rounded-full`} />
        <div className={`${shimmer} h-[20px] w-[55px] rounded-full`} />
        <div className={`${shimmer} h-[20px] w-[48px] rounded-full`} />
        <div className={`${shimmer} h-[12px] w-[90px] ml-auto`} />
      </div>
    </div>
  );
}
