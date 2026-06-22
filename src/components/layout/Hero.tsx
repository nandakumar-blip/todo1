// ─────────────────────────────────────────────
//  Hero — KPMG-style hero with stats + quick-add
// ─────────────────────────────────────────────

import { useState } from 'react';
import { useDispatch, useTasks } from '../../context/TaskContext';
import { getSidebarCounts, todayStr } from '../../utils';
import { CATEGORIES } from '../../config';
import type { Priority, Category } from '../../types';

interface HeroProps {
  onTaskAdded: (title: string) => void;
}

export default function Hero({ onTaskAdded }: HeroProps) {
  const tasks    = useTasks();
  const dispatch = useDispatch();
  const counts   = getSidebarCounts(tasks);

  const [title,    setTitle]    = useState('');
  const [desc,     setDesc]     = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('Personal');
  const [due,      setDue]      = useState(todayStr());
  const [tags,     setTags]     = useState('');

  const handleAdd = () => {
    const t = title.trim();
    if (!t) return;
    dispatch({
      type: 'ADD_TASK',
      payload: {
        title: t,
        desc: desc.trim(),
        priority, category, done: false,
        due, tags: tags.split(',').map(s => s.trim()).filter(Boolean),
      },
    });
    setTitle(''); setDesc(''); setTags(''); setDue(todayStr());
    onTaskAdded(t);
  };

  const inputCls = [
    'w-full pl-9 pr-3 py-2.5 rounded-md text-[14px] text-black font-sans',
    'bg-white/8 border border-white/22 placeholder-gray-400 outline-none',
    'focus:border-white/60 focus:bg-white/13 transition-all',
  ].join(' ');

  const selectCls = [
    'flex-1 pl-7 pr-2 py-2 rounded-md text-[13px] text-white font-sans',
    'bg-[rgba(30,40,80,0.85)] border border-white/22 outline-none cursor-pointer appearance-none',
    'focus:border-white/60 transition-all',
  ].join(' ');

  return (
    <section
      className="hero-gradient relative overflow-hidden"
      style={{ paddingTop: 'calc(var(--nav-h) + 3rem)', paddingBottom: '3rem' }}
      aria-label="Task manager hero"
    >
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-8 flex items-start justify-between gap-8 flex-wrap">

        {/* Left: copy + stats */}
        <div className="flex-1 min-w-[280px]">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-white/65 mb-3">
            <i className="ti ti-bolt text-[14px]" aria-hidden="true" />
            ProveIT Catalysts — Personal Task Manager
          </p>
          <h1 className="font-display text-[clamp(28px,4vw,44px)] font-bold text-white leading-[1.18] mb-4">
            Your work,<br />
            <em className="not-italic text-white/75">organized with</em><br />
            precision.
          </h1>
          <p className="text-[15px] text-white/75 leading-relaxed max-w-[480px] mb-6">
            A professional-grade personal task manager for high-performers.
            Prioritize, delegate thinking, and close tasks with clarity.
          </p>

          {/* Stats */}
          <div className="flex gap-8 flex-wrap">
            {[
              { val: counts.total,   label: 'Total Tasks',   icon: 'ti-clipboard-list'  },
              { val: counts.done,    label: 'Completed',     icon: 'ti-circle-check'    },
              { val: counts.high,    label: 'High Priority', icon: 'ti-flame'           },
              { val: counts.overdue, label: 'Overdue',       icon: 'ti-alert-triangle'  },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2.5">
                <div className="w-[38px] h-[38px] rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                  <i className={`ti ${s.icon} text-[18px] text-white`} aria-hidden="true" />
                </div>
                <div>
                  <div className="text-[24px] font-bold text-white leading-none">{s.val}</div>
                  <div className="text-[11px] text-white/65 mt-0.5 uppercase tracking-wider">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick-add card */}
        <div className="flex-shrink-0 w-full md:w-[360px] bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <p className="flex items-center gap-2 text-[14px] font-semibold text-white mb-4">
            <i className="ti ti-plus text-[16px]" aria-hidden="true" />
            Quick Add Task
          </p>
          <div className="flex flex-col gap-2.5">

            {/* Title */}
            <div>
              <div className="relative">
                <i className="ti ti-pencil absolute left-2.5 top-1/2 -translate-y-1/2 text-[15px] text-white/50 pointer-events-none" aria-hidden="true" />
                <input
                  className={inputCls}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdd()}
                  placeholder="e.g. Prepare Q3 board presentation"
                  aria-label="Task title"
                  maxLength={120}
                />
              </div>
              <p className="text-[11px] text-white/40 mt-0.5 pl-0.5">Clear, actionable title</p>
            </div>

            {/* Desc */}
            <div className="relative">
              <i className="ti ti-align-left absolute left-2.5 top-1/2 -translate-y-1/2 text-[15px] text-white/50 pointer-events-none" aria-hidden="true" />
              <input className={inputCls} value={desc} onChange={e => setDesc(e.target.value)}
                placeholder="e.g. Include KPIs, projections, exec summary" aria-label="Description" maxLength={200} />
            </div>

            {/* Priority + Category */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <i className="ti ti-flag absolute left-2 top-1/2 -translate-y-1/2 text-[14px] text-white/50 pointer-events-none z-10" aria-hidden="true" />
                <select className={selectCls} value={priority} onChange={e => setPriority(e.target.value as Priority)} aria-label="Priority">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="flex-1 relative">
                <i className="ti ti-tag absolute left-2 top-1/2 -translate-y-1/2 text-[14px] text-white/50 pointer-events-none z-10" aria-hidden="true" />
                <select className={selectCls} value={category} onChange={e => setCategory(e.target.value as Category)} aria-label="Category">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Due date */}
            <div>
              <div className="relative">
                <i className="ti ti-calendar absolute left-2.5 top-1/2 -translate-y-1/2 text-[15px] text-white/50 pointer-events-none" aria-hidden="true" />
                <input type="date" className={inputCls} value={due} onChange={e => setDue(e.target.value)} aria-label="Due date" />
              </div>
              <p className="text-[11px] text-white/40 mt-0.5 pl-0.5">Set a deadline to stay accountable</p>
            </div>

            {/* Tags */}
            <div className="relative">
              <i className="ti ti-tags absolute left-2.5 top-1/2 -translate-y-1/2 text-[15px] text-white/50 pointer-events-none" aria-hidden="true" />
              <input className={inputCls} value={tags} onChange={e => setTags(e.target.value)}
                placeholder="e.g. strategy, q3, leadership" aria-label="Tags (comma-separated)" />
            </div>

            <button
              onClick={handleAdd}
              className="w-full mt-1 py-2.5 rounded-md bg-white text-accent font-semibold text-[14px] flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] transition-all"
            >
              <i className="ti ti-plus text-[17px]" aria-hidden="true" />
              Add Task
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
