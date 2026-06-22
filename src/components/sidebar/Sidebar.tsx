// ─────────────────────────────────────────────
//  Sidebar — filters for status, priority,
//  category, tags, and progress bar
// ─────────────────────────────────────────────

import { useTasks, useFilters, useDispatch } from '../../context/TaskContext';
import { getSidebarCounts } from '../../utils';
import { CATEGORIES, CATEGORY_META } from '../../config';
import type { StatusFilter, Priority, Category } from '../../types';

interface SidebarProps {
  onClearCompleted: () => void;
  onClearAll: () => void;
}

function SectionTitle({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest sb-label mb-3 pb-2 border-b border-gray-200 dark:border-[#2C3350]">
      <i className={`ti ${icon} text-[13px]`} aria-hidden="true" />
      {children}
    </p>
  );
}

function FilterBtn({
  active, icon, label, count, onClick, iconColor,
}: {
  active: boolean; icon: string; label: string; count?: number;
  onClick: () => void; iconColor?: string;
}) {
  return (
    <button
      className={`filter-btn${active ? ' active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      <span className="flex items-center gap-1.5">
        <i className={`ti ${icon} text-[15px]`} style={iconColor ? { color: iconColor } : {}} aria-hidden="true" />
        {label}
      </span>
      {count !== undefined && <span className="filter-count">{count}</span>}
    </button>
  );
}

export default function Sidebar({ onClearCompleted, onClearAll }: SidebarProps) {
  const tasks    = useTasks();
  const filters  = useFilters();
  const dispatch = useDispatch();
  const counts   = getSidebarCounts(tasks);

  const cardCls = 'bg-white dark:bg-[#1E2235] border border-gray-200 dark:border-[#2C3350] rounded-xl p-5 mb-4 shadow-sm transition-colors';

  return (
    <aside aria-label="Task filters" className="w-full md:sticky md:top-[calc(var(--nav-h)+1rem)]">

      {/* Progress */}
      <div className={cardCls}>
        <SectionTitle icon="ti-trending-up">Overall Progress</SectionTitle>
        <div className="flex justify-between text-[12px] text-gray-500 dark:text-gray-400 mb-1.5">
          <span>{counts.done} of {counts.total} done</span>
          <span>{counts.pct}%</span>
        </div>
        <div className="h-1.5 bg-gray-200 dark:bg-[#2C3350] rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${counts.pct}%` }}
            role="progressbar"
            aria-valuenow={counts.pct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Status */}
      <div className={cardCls}>
        <SectionTitle icon="ti-filter">Filter by Status</SectionTitle>
        {([ ['all','All Tasks','ti-layout-list'], ['active','Active','ti-player-play'],
             ['done','Completed','ti-circle-check'], ['overdue','Overdue','ti-alert-triangle'],
          ] as [StatusFilter, string, string][]).map(([id, label, icon]) => (
          <FilterBtn key={id} active={filters.status === id} icon={icon} label={label}
            count={{ all: counts.total, active: counts.active, done: counts.done, overdue: counts.overdue }[id]}
            onClick={() => dispatch({ type: 'SET_FILTER', payload: { status: id } })} />
        ))}
      </div>

      {/* Priority */}
      <div className={cardCls}>
        <SectionTitle icon="ti-flag">Filter by Priority</SectionTitle>
        <FilterBtn active={filters.priority === 'all'} icon="ti-adjustments-horizontal" label="All Priorities"
          onClick={() => dispatch({ type: 'SET_FILTER', payload: { priority: 'all' } })} />
        {([
          ['high',   'High',   'ti-flame',       'var(--tw-color-red-500,#EF4444)'],
          ['medium', 'Medium', 'ti-arrow-right',  '#D97706'],
          ['low',    'Low',    'ti-arrow-down',   '#059669'],
        ] as [Priority, string, string, string][]).map(([id, label, icon, color]) => (
          <FilterBtn key={id} active={filters.priority === id} icon={icon} label={label}
            count={{ high: counts.high, medium: counts.medium, low: counts.low }[id]}
            iconColor={color}
            onClick={() => dispatch({ type: 'SET_FILTER', payload: { priority: id } })} />
        ))}
      </div>

      {/* Categories */}
      <div className={cardCls}>
        <SectionTitle icon="ti-apps">Categories</SectionTitle>
        <FilterBtn active={filters.category === 'all'} icon="ti-border-all" label="All Categories"
          onClick={() => dispatch({ type: 'SET_FILTER', payload: { category: 'all' } })} />
        {CATEGORIES.map(cat => {
          const meta = CATEGORY_META[cat];
          return (
            <FilterBtn key={cat} active={filters.category === cat}
              icon={`ti-${meta.icon}`} label={cat} iconColor={meta.color}
              count={counts.catCounts[cat]}
              onClick={() => dispatch({ type: 'SET_FILTER', payload: { category: cat as Category } })} />
          );
        })}
      </div>

      {/* Tags */}
      <div className={cardCls}>
        <SectionTitle icon="ti-tags">Tags</SectionTitle>
        {counts.allTags.length === 0 ? (
          <span className="text-[12px] text-gray-400 dark:text-gray-500">No tags yet.</span>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {counts.allTags.map(tag => (
              <button
                key={tag}
                onClick={() => dispatch({ type: 'SET_FILTER', payload: { tag: filters.tag === tag ? null : tag } })}
                className={[
                  'tag-pill flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold',
                  'border transition-all',
                  filters.tag === tag ? 'border-accent shadow-[0_0_0_1px_var(--accent)]' : 'border-transparent',
                ].join(' ')}
                aria-label={`Filter by tag: ${tag}`}
                aria-pressed={filters.tag === tag}
              >
                <i className="ti ti-tag text-[12px]" aria-hidden="true" />
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={cardCls + ' flex flex-col gap-2'}>
        <button
          onClick={onClearCompleted}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-md bg-accent text-white text-[13px] font-semibold hover:opacity-90 transition-all"
        >
          <i className="ti ti-trash text-[15px]" aria-hidden="true" />
          Clear Completed
        </button>
        <button
          onClick={onClearAll}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-md border border-gray-200 dark:border-[#2C3350] bg-white dark:bg-[#1E2235] text-red-500 text-[12px] font-medium hover:bg-red-50 dark:hover:bg-[#3A1818] hover:border-red-300 transition-all"
        >
          <i className="ti ti-trash-x text-[14px]" aria-hidden="true" />
          Clear All Tasks
        </button>
      </div>

    </aside>
  );
}
