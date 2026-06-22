// ─────────────────────────────────────────────
//  Utility helpers: dates, IDs, task filtering
// ─────────────────────────────────────────────

import type { Task, FilterState } from '../types';
import { PRIORITY_ORDER } from '../config';

/** Generate a unique task ID */
export function uid(): string {
  return 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/** Generate a unique subtask ID */
export function subUid(): string {
  return 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

/** Today as YYYY-MM-DD */
export function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

/** Is a task overdue? (due date in the past, not done) */
export function isOverdue(due: string, done: boolean): boolean {
  if (!due || done) return false;
  return new Date(due) < new Date(new Date().toDateString());
}

/** Is task due exactly today? */
export function isDueToday(due: string): boolean {
  return !!due && due === todayStr();
}

/** Is task due within 3 days (not overdue)? */
export function isDueSoon(due: string, done: boolean): boolean {
  if (!due || done) return false;
  const diff = (new Date(due).getTime() - Date.now()) / 86400000;
  return diff >= 0 && diff <= 3;
}

/** Format date to human-readable "15 Jan 2025" */
export function formatDate(due: string): string {
  if (!due) return '';
  return new Date(due + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

/** Filter and sort tasks based on current FilterState */
export function getFilteredTasks(tasks: Task[], filters: FilterState): Task[] {
  let list = [...tasks];

  // Status
  if (filters.status === 'active')  list = list.filter(t => !t.done);
  if (filters.status === 'done')    list = list.filter(t => t.done);
  if (filters.status === 'overdue') list = list.filter(t => isOverdue(t.due, t.done));

  // Priority
  if (filters.priority !== 'all') list = list.filter(t => t.priority === filters.priority);

  // Category
  if (filters.category !== 'all') list = list.filter(t => t.category === filters.category);

  // Tag
  if (filters.tag) list = list.filter(t => t.tags.includes(filters.tag!));

  // Search
  const q = filters.search.toLowerCase().trim();
  if (q) list = list.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.desc.toLowerCase().includes(q) ||
    t.tags.some(tag => tag.includes(q))
  );

  // Sort
  switch (filters.sort) {
    case 'due':
      list.sort((a, b) => {
        if (!a.due && !b.due) return 0;
        if (!a.due) return 1;
        if (!b.due) return -1;
        return new Date(a.due).getTime() - new Date(b.due).getTime();
      });
      break;
    case 'priority':
      list.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
      break;
    case 'alpha':
      list.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default: // 'created' — newest first
      list.sort((a, b) => b.createdAt - a.createdAt);
  }

  return list;
}

/** Derive sidebar counts from tasks */
export function getSidebarCounts(tasks: Task[]) {
  const total    = tasks.length;
  const done     = tasks.filter(t => t.done).length;
  const active   = tasks.filter(t => !t.done).length;
  const overdue  = tasks.filter(t => isOverdue(t.due, t.done)).length;
  const high     = tasks.filter(t => t.priority === 'high').length;
  const medium   = tasks.filter(t => t.priority === 'medium').length;
  const low      = tasks.filter(t => t.priority === 'low').length;
  const pct      = total ? Math.round((done / total) * 100) : 0;
  const dueToday = tasks.filter(t => isDueToday(t.due) && !t.done).length;
  const subsDone = tasks.reduce((acc, t) => acc + t.subtasks.filter(s => s.done).length, 0);
  const categories = new Set(tasks.map(t => t.category)).size;
  const allTags   = Array.from(new Set(tasks.flatMap(t => t.tags)));

  const catCounts = {
    Work: tasks.filter(t => t.category === 'Work').length,
    Personal: tasks.filter(t => t.category === 'Personal').length,
    Health: tasks.filter(t => t.category === 'Health').length,
    Learning: tasks.filter(t => t.category === 'Learning').length,
    Finance: tasks.filter(t => t.category === 'Finance').length,
  };

  return { total, done, active, overdue, high, medium, low, pct, dueToday, subsDone, categories, allTags, catCounts };
}
