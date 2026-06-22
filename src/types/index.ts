// ─────────────────────────────────────────────
//  Core domain types for ProveIT Catalysts
// ─────────────────────────────────────────────

export type Priority = 'high' | 'medium' | 'low';
export type Category = 'Work' | 'Personal' | 'Health' | 'Learning' | 'Finance';
export type Theme    = 'blue' | 'dark' | 'green';
export type ViewMode = 'list' | 'grid';
export type SortKey  = 'created' | 'due' | 'priority' | 'alpha';
export type StatusFilter = 'all' | 'active' | 'done' | 'overdue';

export interface Subtask {
  id: string;
  text: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  desc: string;
  priority: Priority;
  category: Category;
  done: boolean;
  due: string;       // ISO date string YYYY-MM-DD or ''
  tags: string[];
  createdAt: number; // timestamp
  subtasks: Subtask[];
}

export interface FilterState {
  status: StatusFilter;
  priority: Priority | 'all';
  category: Category | 'all';
  tag: string | null;
  search: string;
  sort: SortKey;
}
