// ─────────────────────────────────────────────
//  TaskCard — individual task with subtasks,
//  priority bar, badges, drag-and-drop
// ─────────────────────────────────────────────

import { useState, useRef } from 'react';
import { useDispatch } from '../../context/TaskContext';
import { isOverdue, isDueToday, isDueSoon, formatDate } from '../../utils';
import { CATEGORY_META, PRIORITY_META } from '../../config';
import type { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDragStart: (id: string) => void;
  onDrop: (targetId: string) => void;
}

export default function TaskCard({ task, onEdit, onDragStart, onDrop }: TaskCardProps) {
  const dispatch   = useDispatch();
  const [dragOver, setDragOver] = useState(false);
  const [showSubInput, setShowSubInput] = useState(false);
  const [subText, setSubText] = useState('');
  const subInputRef = useRef<HTMLInputElement>(null);
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editingSubText, setEditingSubText] = useState('');
  const editingRef = useRef<HTMLInputElement>(null);

  const catMeta = CATEGORY_META[task.category];
  const priMeta = PRIORITY_META[task.priority];
  const overdue = isOverdue(task.due, task.done);
  const today   = isDueToday(task.due);
  const soon    = isDueSoon(task.due, task.done);

  const priBarColor = { high: '#DC2626', medium: '#D97706', low: '#059669' }[task.priority];

  const doneSubs = task.subtasks.filter(s => s.done).length;
  const totalSubs = task.subtasks.length;
  const subPct = totalSubs ? Math.round((doneSubs / totalSubs) * 100) : 0;

  const priBadgeCls = {
    high:   'bg-red-50   dark:bg-[#3A1818] text-red-600   dark:text-[#FF7070]',
    medium: 'bg-amber-50 dark:bg-[#3A2C10] text-amber-600 dark:text-[#FBBF24]',
    low:    'bg-green-50 dark:bg-[#0E2A1C] text-green-600 dark:text-[#34D399]',
  }[task.priority];

  const addSubtask = () => {
    const t = subText.trim();
    if (!t) return;
    dispatch({ type: 'ADD_SUBTASK', taskId: task.id, text: t });
    setSubText('');
    setShowSubInput(false);
  };

  return (
    <article
      draggable
      onDragStart={() => onDragStart(task.id)}
      onDragEnd={() => setDragOver(false)}
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); onDrop(task.id); }}
      className={[
        'relative overflow-hidden rounded-xl border transition-all duration-200',
        'bg-white dark:bg-[#1E2235]',
        'animate-fade-in-up',
        task.done
          ? 'opacity-75 bg-green-50/60 dark:bg-[#0E2A1C]/60 border-green-200 dark:border-[#155535]'
          : 'border-gray-200 dark:border-[#2C3350] shadow-sm hover:shadow-md hover:-translate-y-px',
        dragOver ? 'border-accent shadow-[0_0_0_2px_var(--accent-light)]' : '',
      ].join(' ')}
      aria-label={`Task: ${task.title}`}
    >
      {/* Priority bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: priBarColor }} />

      <div className="pl-4 pr-4 pt-3.5 pb-3.5">

        {/* Header row */}
        <div className="flex items-start gap-2.5 mb-2">
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => dispatch({ type: 'TOGGLE_TASK', id: task.id })}
            className="mt-0.5 w-[18px] h-[18px] flex-shrink-0 rounded cursor-pointer accent-[var(--accent)]"
            aria-label={`Mark "${task.title}" as ${task.done ? 'incomplete' : 'complete'}`}
          />
          <div className="flex-1 min-w-0">
            <p className={`text-[14px] font-medium leading-snug mb-1 ${task.done ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-[#E8EAF0]'}`}>
              {task.title}
            </p>
            {task.desc && (
              <p className="text-[12px] text-gray-500 dark:text-[#8090AA] leading-relaxed">{task.desc}</p>
            )}
          </div>

          {/* Action buttons — appear on hover */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1 flex-shrink-0 task-actions">
            <button
              onClick={() => onEdit(task)}
              className="w-7 h-7 rounded-md border border-gray-200 dark:border-[#2C3350] bg-white dark:bg-[#1E2235] text-gray-400 dark:text-[#8090AA] flex items-center justify-center hover:border-accent hover:text-accent dark:hover:text-accent hover:bg-accent-light transition-all"
              aria-label="Edit task"
            >
              <i className="ti ti-edit text-[14px]" aria-hidden="true" />
            </button>
            <button
              onClick={() => dispatch({ type: 'DELETE_TASK', id: task.id })}
              className="w-7 h-7 rounded-md border border-gray-200 dark:border-[#2C3350] bg-white dark:bg-[#1E2235] text-gray-400 dark:text-[#8090AA] flex items-center justify-center hover:border-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-[#3A1818] transition-all"
              aria-label="Delete task"
            >
              <i className="ti ti-trash text-[14px]" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Badges row */}
        <div className="flex items-center justify-between flex-wrap gap-1.5 mt-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Priority */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${priBadgeCls}`}>
              <i className={`ti ti-${priMeta.icon} text-[12px]`} aria-hidden="true" />
              {priMeta.label}
            </span>
            {/* Category */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 dark:bg-[#252A3D] text-gray-600 dark:text-[#C8D4E8]">
              <i className={`ti ti-${catMeta.icon} text-[12px]`} style={{ color: catMeta.color }} aria-hidden="true" />
              {task.category}
            </span>
            {/* Done */}
            {task.done && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-green-50 dark:bg-[#0E2A1C] text-green-700 dark:text-[#4ADE80]">
                <i className="ti ti-circle-check text-[12px]" aria-hidden="true" />Done
              </span>
            )}
            {/* Tags */}
            {task.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium tag-pill cursor-pointer">
                <i className="ti ti-tag text-[12px]" aria-hidden="true" />#{tag}
              </span>
            ))}
          </div>

          {/* Due date */}
          {task.due && (
            <span className={[
              'flex items-center gap-1 text-[11px]',
              overdue ? 'text-red-500 dark:text-[#FF7070] font-medium' : soon ? 'text-amber-500 dark:text-[#FBBF24] font-medium' : 'text-gray-400 dark:text-[#8090AA]',
            ].join(' ')}>
              <i className={`ti ${overdue ? 'ti-alert-triangle' : today ? 'ti-calendar-event' : 'ti-calendar'} text-[13px]`} aria-hidden="true" />
              {overdue ? 'Overdue · ' : today ? 'Today · ' : ''}{formatDate(task.due)}
            </span>
          )}
        </div>

        {/* Subtasks */}
        {totalSubs > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#2C3350]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-[#8090AA]">
                <i className="ti ti-subtask text-[13px]" aria-hidden="true" />Subtasks
              </span>
              <span className="text-[11px] text-gray-400 dark:text-[#8090AA]">{doneSubs}/{totalSubs}</span>
            </div>
            {/* Mini progress bar */}
            <div className="h-[3px] bg-gray-200 dark:bg-[#2C3350] rounded-full overflow-hidden mb-2">
              <div className="h-full bg-accent rounded-full transition-all duration-300" style={{ width: `${subPct}%` }} />
            </div>
            {task.subtasks.map(sub => (
              <div key={sub.id} className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  checked={sub.done}
                  onChange={() => dispatch({ type: 'TOGGLE_SUBTASK', taskId: task.id, subId: sub.id })}
                  className="w-[14px] h-[14px] flex-shrink-0 rounded cursor-pointer accent-[var(--accent)]"
                  aria-label={`Subtask: ${sub.text}`}
                />
                <i className={`ti ${sub.done ? 'ti-circle-check' : 'ti-circle'} text-[13px] flex-shrink-0 ${sub.done ? 'text-green-500 dark:text-[#34D399]' : 'text-gray-400 dark:text-[#8090AA]'}`} aria-hidden="true" />
                {editingSubId === sub.id ? (
                  <input
                    ref={editingRef}
                    value={editingSubText}
                    onChange={e => setEditingSubText(e.target.value)}
                    onBlur={() => {
                      const t = editingSubText.trim();
                      if (t) dispatch({ type: 'UPDATE_SUBTASK', taskId: task.id, subId: sub.id, text: t });
                      setEditingSubId(null);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') { const t = editingSubText.trim(); if (t) dispatch({ type: 'UPDATE_SUBTASK', taskId: task.id, subId: sub.id, text: t }); setEditingSubId(null); }
                      if (e.key === 'Escape') setEditingSubId(null);
                    }}
                    className="flex-1 px-2 py-1 text-[12px] rounded border border-gray-200 dark:border-[#2C3350] bg-gray-50 dark:bg-[#1A1D27] text-gray-800 dark:text-[#E8EAF0] placeholder-gray-400 outline-none focus:border-accent transition-colors"
                    autoFocus
                  />
                ) : (
                  <span
                    onDoubleClick={() => { setEditingSubId(sub.id); setEditingSubText(sub.text); setTimeout(() => editingRef.current?.focus(), 50); }}
                    className={`text-[12px] ${sub.done ? 'line-through text-gray-400 dark:text-[#8090AA]' : 'text-gray-600 dark:text-[#B0BBCC]'}`}
                    title="Double-click to edit"
                  >
                    {sub.text}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add subtask */}
        {showSubInput ? (
          <div className="flex gap-2 mt-2.5">
            <input
              ref={subInputRef}
              autoFocus
              value={subText}
              onChange={e => setSubText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addSubtask(); if (e.key === 'Escape') setShowSubInput(false); }}
              placeholder="e.g. Review draft with manager"
              className="flex-1 px-2 py-1 text-[12px] rounded border border-gray-200 dark:border-[#2C3350] bg-gray-50 dark:bg-[#1A1D27] text-gray-800 dark:text-[#E8EAF0] placeholder-gray-400 outline-none focus:border-accent transition-colors"
              aria-label="New subtask text"
              maxLength={100}
            />
            <button onClick={addSubtask}
              className="flex items-center gap-1 px-2 py-1 rounded text-[12px] bg-accent text-white hover:opacity-90 transition-all">
              <i className="ti ti-plus text-[13px]" aria-hidden="true" />Add
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setShowSubInput(true); setTimeout(() => subInputRef.current?.focus(), 50); }}
            className="flex items-center gap-1.5 mt-2.5 text-[11px] font-medium text-accent hover:opacity-70 transition-all"
          >
            <i className="ti ti-plus text-[14px]" aria-hidden="true" />Add subtask
          </button>
        )}
      </div>

      {/* Hover reveal for action buttons */}
      <style>{`.task-actions { opacity: 0; } article:hover .task-actions { opacity: 1; }`}</style>
    </article>
  );
}
