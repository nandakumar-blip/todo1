// ─────────────────────────────────────────────
//  TaskContext — single source of truth for tasks
//  and filter state. Persists to localStorage.
// ─────────────────────────────────────────────

import {
  createContext, useContext, useReducer, useEffect,
  type ReactNode, type Dispatch,
} from 'react';
import type { Task, Subtask, FilterState } from '../types';
import { SEED_TASKS } from '../config';
import { uid, subUid, todayStr } from '../utils';

// ── State shape ──────────────────────────────
interface State {
  tasks: Task[];
  filters: FilterState;
}

const INITIAL_FILTERS: FilterState = {
  status: 'all', priority: 'all', category: 'all',
  tag: null, search: '', sort: 'created',
};

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem('pc_tasks');
    if (raw) return JSON.parse(raw) as Task[];
  } catch {}
  return JSON.parse(JSON.stringify(SEED_TASKS));
}

const initialState: State = {
  tasks: loadTasks(),
  filters: INITIAL_FILTERS,
};

// ── Actions ──────────────────────────────────
type Action =
  | { type: 'ADD_TASK';       payload: Omit<Task, 'id' | 'createdAt' | 'subtasks'> }
  | { type: 'UPDATE_TASK';    payload: Task }
  | { type: 'DELETE_TASK';    id: string }
  | { type: 'TOGGLE_TASK';    id: string }
  | { type: 'TOGGLE_SUBTASK'; taskId: string; subId: string }
  | { type: 'ADD_SUBTASK';    taskId: string; text: string }
  | { type: 'UPDATE_SUBTASK'; taskId: string; subId: string; text: string }
  | { type: 'REORDER_TASKS';  fromId: string; toId: string }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'CLEAR_ALL' }
  | { type: 'SET_FILTER';     payload: Partial<FilterState> };

// ── Reducer ──────────────────────────────────
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TASK': {
      const newTask: Task = {
        ...action.payload,
        id: uid(),
        createdAt: Date.now(),
        subtasks: [],
      };
      return { ...state, tasks: [newTask, ...state.tasks] };
    }
    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.id) };
    case 'TOGGLE_TASK':
      return { ...state, tasks: state.tasks.map(t => t.id === action.id ? { ...t, done: !t.done } : t) };
    case 'TOGGLE_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.taskId
            ? { ...t, subtasks: t.subtasks.map((s: Subtask) => s.id === action.subId ? { ...s, done: !s.done } : s) }
            : t
        ),
      };
    case 'ADD_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.taskId
            ? { ...t, subtasks: [...t.subtasks, { id: subUid(), text: action.text, done: false }] }
            : t
        ),
      };
    case 'UPDATE_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.taskId
            ? { ...t, subtasks: t.subtasks.map(s => s.id === action.subId ? { ...s, text: action.text } : s) }
            : t
        ),
      };
    case 'REORDER_TASKS': {
      const tasks = [...state.tasks];
      const fi = tasks.findIndex(t => t.id === action.fromId);
      const ti = tasks.findIndex(t => t.id === action.toId);
      if (fi > -1 && ti > -1) { const [m] = tasks.splice(fi, 1); tasks.splice(ti, 0, m); }
      return { ...state, tasks };
    }
    case 'CLEAR_COMPLETED':
      return { ...state, tasks: state.tasks.filter(t => !t.done) };
    case 'CLEAR_ALL':
      return { ...state, tasks: [] };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    default:
      return state;
  }
}

// ── Context ──────────────────────────────────
interface TaskContextValue {
  state: State;
  dispatch: Dispatch<Action>;
}

const TaskContext = createContext<TaskContextValue>({
  state: initialState,
  dispatch: () => {},
});

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist tasks on change
  useEffect(() => {
    try { localStorage.setItem('pc_tasks', JSON.stringify(state.tasks)); } catch {}
  }, [state.tasks]);

  return <TaskContext.Provider value={{ state, dispatch }}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  return useContext(TaskContext);
}

// ── Convenience hooks ─────────────────────────
export function useTasks()   { return useTaskContext().state.tasks; }
export function useFilters() { return useTaskContext().state.filters; }
export function useDispatch(){ return useTaskContext().dispatch; }

// ── Quick-add helper ──────────────────────────
export { todayStr };
