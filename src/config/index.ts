// ─────────────────────────────────────────────
//  App-wide config: seed tasks, label maps, etc.
//  Edit this file to customise default content.
// ─────────────────────────────────────────────

import type { Task, Category, Priority } from '../types';

// ── Helper ──────────────────────────────────
function offsetDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// ── Category metadata ────────────────────────
export const CATEGORY_META: Record<Category, { icon: string; color: string }> = {
  Work:     { icon: 'briefcase',         color: '#3B82F6' },
  Personal: { icon: 'user',              color: '#8B5CF6' },
  Health:   { icon: 'heart-rate-monitor',color: '#10B981' },
  Learning: { icon: 'book',              color: '#F59E0B' },
  Finance:  { icon: 'coin',              color: '#EF4444' },
};

export const CATEGORIES: Category[] = ['Work', 'Personal', 'Health', 'Learning', 'Finance'];

// ── Priority metadata ────────────────────────
export const PRIORITY_META: Record<Priority, { label: string; icon: string }> = {
  high:   { label: 'High',   icon: 'flame' },
  medium: { label: 'Medium', icon: 'arrow-right' },
  low:    { label: 'Low',    icon: 'arrow-down' },
};

export const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

// ── Seed tasks ───────────────────────────────
export const SEED_TASKS: Task[] = [
  {
    id: 't1', title: 'Prepare Q3 performance review',
    desc: 'Compile metrics, peer feedback, and achievement highlights for annual review.',
    priority: 'high', category: 'Work', done: false,
    due: offsetDate(2), tags: ['review', 'quarterly'],
    createdAt: Date.now() - 86400000 * 3,
    subtasks: [
      { id: 's1a', text: 'Gather KPI spreadsheet', done: true },
      { id: 's1b', text: 'Write self-assessment section', done: false },
      { id: 's1c', text: 'Request peer feedback', done: false },
    ],
  },
  {
    id: 't2', title: 'Run 5K three times this week',
    desc: 'Stick to the training schedule. Morning runs before 8AM.',
    priority: 'medium', category: 'Health', done: false,
    due: offsetDate(5), tags: ['fitness', 'habit'],
    createdAt: Date.now() - 86400000 * 1,
    subtasks: [
      { id: 's2a', text: 'Monday run — 5K', done: true },
      { id: 's2b', text: 'Wednesday run — 5K', done: false },
      { id: 's2c', text: 'Friday run — 5K', done: false },
    ],
  },
  {
    id: 't3', title: 'Complete TypeScript advanced course',
    desc: 'Finish Modules 7–10 on generics, decorators, and advanced patterns.',
    priority: 'medium', category: 'Learning', done: false,
    due: offsetDate(14), tags: ['typescript', 'dev'],
    createdAt: Date.now() - 86400000 * 5,
    subtasks: [
      { id: 's3a', text: 'Module 7: Generics', done: true },
      { id: 's3b', text: 'Module 8: Decorators', done: true },
      { id: 's3c', text: 'Module 9: Advanced patterns', done: false },
      { id: 's3d', text: 'Module 10: Final project', done: false },
    ],
  },
  {
    id: 't4', title: 'Rebalance investment portfolio',
    desc: 'Check asset allocation against target. Consider rebalancing equities vs bonds.',
    priority: 'high', category: 'Finance', done: false,
    due: offsetDate(-1), tags: ['investing', 'monthly'],
    createdAt: Date.now() - 86400000 * 7, subtasks: [],
  },
  {
    id: 't5', title: 'Book flights for year-end holiday',
    desc: 'Compare options for December trip. Check baggage and cancellation terms.',
    priority: 'low', category: 'Personal', done: false,
    due: offsetDate(30), tags: ['travel', 'personal'],
    createdAt: Date.now() - 86400000 * 2,
    subtasks: [
      { id: 's5a', text: 'Check preferred dates', done: false },
      { id: 's5b', text: 'Compare airline prices', done: false },
    ],
  },
  {
    id: 't6', title: 'Onboard new team member — Alex',
    desc: 'Prepare access, schedule intro calls, share team handbook.',
    priority: 'high', category: 'Work', done: true,
    due: offsetDate(-3), tags: ['onboarding', 'team'],
    createdAt: Date.now() - 86400000 * 10,
    subtasks: [
      { id: 's6a', text: 'Create system accounts', done: true },
      { id: 's6b', text: 'Schedule 1:1s', done: true },
      { id: 's6c', text: 'Share resource docs', done: true },
    ],
  },
  {
    id: 't7', title: 'Refactor auth module in main API',
    desc: 'Move from session-based to JWT. Update middleware and integration tests.',
    priority: 'medium', category: 'Work', done: false,
    due: offsetDate(7), tags: ['dev', 'api'],
    createdAt: Date.now() - 86400000 * 4,
    subtasks: [
      { id: 's7a', text: 'Design JWT token structure', done: true },
      { id: 's7b', text: 'Implement refresh token flow', done: false },
      { id: 's7c', text: 'Write integration tests', done: false },
    ],
  },
  {
    id: 't8', title: 'Schedule annual health check-up',
    desc: 'Book GP appointment and blood panel. Bring previous test results.',
    priority: 'low', category: 'Health', done: true,
    due: offsetDate(-5), tags: ['health', 'admin'],
    createdAt: Date.now() - 86400000 * 15, subtasks: [],
  },
  {
    id: 't9', title: 'Prepare client presentation — Acme Corp',
    desc: 'Assemble slides, refine recommendations, and rehearse the demo.',
    priority: 'high', category: 'Work', done: false,
    due: offsetDate(4), tags: ['client', 'presentation'],
    createdAt: Date.now() - 86400000 * 2,
    subtasks: [
      { id: 's9a', text: 'Draft slide deck', done: true },
      { id: 's9b', text: 'Create demo recording', done: false },
      { id: 's9c', text: 'Rehearse with team', done: false },
    ],
  },
  {
    id: 't10', title: 'Weekly grocery shopping',
    desc: 'Buy essentials and plan meals for the week.',
    priority: 'low', category: 'Personal', done: false,
    due: offsetDate(2), tags: ['errands', 'home'],
    createdAt: Date.now() - 86400000 * 1,
    subtasks: [
      { id: 's10a', text: 'Check pantry for staples', done: true },
      { id: 's10b', text: 'Make shopping list', done: false },
      { id: 's10c', text: 'Visit store or order online', done: false },
    ],
  },
  {
    id: 't11', title: 'Learn Docker basics',
    desc: 'Get comfortable with containers and Docker workflows.',
    priority: 'medium', category: 'Learning', done: false,
    due: offsetDate(10), tags: ['devops', 'learning'],
    createdAt: Date.now() - 86400000 * 6,
    subtasks: [
      { id: 's11a', text: 'Read Docker overview', done: true },
      { id: 's11b', text: 'Build a sample Dockerfile', done: false },
      { id: 's11c', text: 'Run containerized app locally', done: false },
    ],
  },
];
