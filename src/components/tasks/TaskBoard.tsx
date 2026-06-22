// ─────────────────────────────────────────────
//  TaskBoard — search/sort/view controls + task list
// ─────────────────────────────────────────────

import { useState, useRef } from 'react';
import { useDispatch, useTasks, useFilters } from '../../context/TaskContext';
import { getFilteredTasks } from '../../utils';
import TaskCard from './TaskCard';
import EditModal from './EditModal';
import SkeletonCard from '../ui/SkeletonCard';
import type { Task, ViewMode, SortKey } from '../../types';

const BOARD_TITLE: Record<string, { label: string; icon: string }> = {
  all:     { label: 'All Tasks',       icon: 'ti-layout-kanban'  },
  active:  { label: 'Active Tasks',    icon: 'ti-player-play'    },
  done:    { label: 'Completed Tasks', icon: 'ti-circle-check'   },
  overdue: { label: 'Overdue Tasks',   icon: 'ti-alert-triangle' },
};

interface TaskBoardProps {
  loading: boolean;
}

export default function TaskBoard({ loading }: TaskBoardProps) {
  const tasks    = useTasks();
  const filters  = useFilters();
  const dispatch = useDispatch();

  const [viewMode,   setViewMode]   = useState<ViewMode>('list');
  const [editTask,   setEditTask]   = useState<Task | null>(null);
  const dragIdRef = useRef<string | null>(null);

  const filtered = getFilteredTasks(tasks, filters);
  const { label, icon } = BOARD_TITLE[filters.status] ?? BOARD_TITLE.all;

  const handleDragStart = (id: string) => { dragIdRef.current = id; };
  const handleDrop = (targetId: string) => {
    if (dragIdRef.current && dragIdRef.current !== targetId) {
      dispatch({ type: 'REORDER_TASKS', fromId: dragIdRef.current, toId: targetId });
    }
    dragIdRef.current = null;
  };

  return (
    <section className="min-w-0" aria-label="Task list">

      {/* Board header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h2 className="flex items-center gap-2 text-[18px] font-semibold text-gray-900 dark:text-[#E8EAF0] tracking-tight">
          <i className={`ti ${icon} text-[20px] text-accent`} aria-hidden="true" />
          {label}
        </h2>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <i className="ti ti-search absolute left-2.5 top-1/2 -translate-y-1/2 text-[15px] text-gray-400 dark:text-[#8090AA] pointer-events-none" aria-hidden="true" />
            <input
              type="search"
              value={filters.search}
              onChange={e => dispatch({ type: 'SET_FILTER', payload: { search: e.target.value } })}
              placeholder="Search tasks…"
              className="pl-9 pr-3 py-2 w-[200px] focus:w-[240px] text-[13px] rounded-md border border-gray-200 dark:border-[#2C3350] bg-white dark:bg-[#1E2235] text-gray-800 dark:text-[#E8EAF0] placeholder-gray-400 dark:placeholder-[#8090AA] outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-light)] transition-all font-sans"
              aria-label="Search tasks"
            />
          </div>

          {/* Sort */}
          <select
            value={filters.sort}
            onChange={e => dispatch({ type: 'SET_FILTER', payload: { sort: e.target.value as SortKey } })}
            className="py-2 px-3 text-[13px] rounded-md border border-gray-200 dark:border-[#2C3350] bg-white dark:bg-[#1E2235] text-gray-600 dark:text-[#B0BBCC] outline-none cursor-pointer font-sans"
            aria-label="Sort tasks"
          >
            <option value="created">Newest First</option>
            <option value="due">Due Date</option>
            <option value="priority">Priority</option>
            <option value="alpha">A–Z</option>
          </select>

          {/* View toggle */}
          <div className="flex border border-gray-200 dark:border-[#2C3350] rounded-md overflow-hidden" role="group" aria-label="View mode">
            {(['list', 'grid'] as ViewMode[]).map(v => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                aria-pressed={viewMode === v}
                title={`${v === 'list' ? 'List' : 'Grid'} view`}
                className={[
                  'p-2 flex items-center transition-all',
                  viewMode === v
                    ? 'bg-accent text-white'
                    : 'bg-white dark:bg-[#1E2235] text-gray-400 dark:text-[#8090AA] hover:bg-gray-50 dark:hover:bg-[#252A3D]',
                ].join(' ')}
              >
                <i className={`ti ${v === 'list' ? 'ti-layout-list' : 'ti-layout-grid'} text-[16px]`} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task list */}
      <div
        aria-live="polite"
        className={viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3'
          : 'flex flex-col gap-2.5'
        }
      >
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 dark:text-[#8090AA] col-span-full">
            <i className="ti ti-clipboard-off text-[52px] block mb-4 opacity-40 text-accent" aria-hidden="true" />
            <p className="text-[16px] font-medium text-gray-500 dark:text-[#B0BBCC] mb-1">No tasks found</p>
            <p className="text-[13px]">Try adjusting your filters, or add a new task above.</p>
          </div>
        ) : (
          filtered.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={setEditTask}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
            />
          ))
        )}
      </div>

      {/* Edit modal */}
      {editTask && <EditModal task={editTask} onClose={() => setEditTask(null)} />}
    </section>
  );
}
