// ─────────────────────────────────────────────
//  InsightsStrip — KPMG-style analytics bar
// ─────────────────────────────────────────────

import { useTasks } from '../../context/TaskContext';
import { getSidebarCounts } from '../../utils';

export default function InsightsStrip() {
  const tasks  = useTasks();
  const counts = getSidebarCounts(tasks);

  const items = [
    { val: `${counts.pct}%`,      label: 'Completion rate',     icon: 'ti-chart-donut'  },
    { val: counts.dueToday,       label: 'Tasks due today',      icon: 'ti-calendar-due' },
    { val: counts.subsDone,       label: 'Subtasks completed',   icon: 'ti-list-check'   },
    { val: counts.categories,     label: 'Categories active',    icon: 'ti-category'     },
  ];

  return (
    <section
      id="insights"
      aria-label="Task analytics"
      className="bg-white dark:bg-[#1E2235] border-t border-b border-gray-200 dark:border-[#2C3350] py-6 px-8 transition-colors"
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <div
            key={item.label}
            className={[
              'flex items-center gap-3',
              i < items.length - 1 ? 'pr-4 border-r border-gray-200 dark:border-[#2C3350]' : '',
            ].join(' ')}
          >
            <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--accent-light)' }}>
              <i className={`ti ${item.icon} text-[20px] text-accent`} aria-hidden="true" />
            </div>
            <div>
              <div className="text-[24px] font-bold text-accent leading-none mb-0.5">{item.val}</div>
              <div className="text-[12px] text-gray-500 dark:text-gray-400 leading-tight">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
