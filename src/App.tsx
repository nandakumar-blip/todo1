// ─────────────────────────────────────────────
//  App.tsx — root layout, wires everything together
// ─────────────────────────────────────────────

import { useRef, useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { TaskProvider, useDispatch } from './context/TaskContext';
import { useToast } from './hooks/useToast';

import Navbar         from './components/layout/Navbar';
import Hero           from './components/layout/Hero';
import InsightsStrip  from './components/layout/InsightsStrip';
import Footer         from './components/layout/Footer';
import Sidebar        from './components/sidebar/Sidebar';
import TaskBoard      from './components/tasks/TaskBoard';
import ToastContainer from './components/ui/ToastContainer';
import BackToTop      from './components/ui/BackToTop';

function InnerApp() {
  const dispatch              = useDispatch();
  const { toasts, showToast } = useToast();
  const boardRef              = useRef<HTMLDivElement>(null);
  const insightsRef           = useRef<HTMLElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const scrollToBoard    = () => boardRef.current?.scrollIntoView({ behavior: 'smooth' });
  const scrollToInsights = () => insightsRef.current?.scrollIntoView({ behavior: 'smooth' });

  const handleTaskAdded = (title: string) => {
    showToast('Task added: ' + title, 'ti-circle-check');
    scrollToBoard();
  };

  const handleClearCompleted = () => {
    dispatch({ type: 'CLEAR_COMPLETED' });
    showToast('Completed tasks cleared', 'ti-trash');
  };

  const handleClearAll = () => {
    if (!window.confirm('Clear all tasks? This cannot be undone.')) return;
    dispatch({ type: 'CLEAR_ALL' });
    showToast('All tasks cleared', 'ti-trash');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1A1D27] transition-colors">
      <Navbar onScrollToBoard={scrollToBoard} onScrollToInsights={scrollToInsights} />
      <Hero onTaskAdded={handleTaskAdded} />
      <InsightsStrip />
      <div
        ref={boardRef}
        id="board"
        className="max-w-[1200px] mx-auto px-4 sm:px-8 py-8 grid gap-6 grid-cols-1 md:[grid-template-columns:260px_1fr]"
      >
        <Sidebar onClearCompleted={handleClearCompleted} onClearAll={handleClearAll} />
        <TaskBoard loading={loading} />
      </div>
      <Footer />
      <BackToTop />
      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <InnerApp />
      </TaskProvider>
    </ThemeProvider>
  );
}
