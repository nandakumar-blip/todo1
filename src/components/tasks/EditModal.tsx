// ─────────────────────────────────────────────
//  EditModal — full task edit form in a modal
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useDispatch } from '../../context/TaskContext';
import { CATEGORIES } from '../../config';
import type { Task, Priority, Category } from '../../types';

interface EditModalProps {
  task: Task | null;
  onClose: () => void;
}

export default function EditModal({ task, onClose }: EditModalProps) {
  const dispatch = useDispatch();

  const [title,    setTitle]    = useState('');
  const [desc,     setDesc]     = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('Personal');
  const [due,      setDue]      = useState('');
  const [tags,     setTags]     = useState('');

  // Populate fields when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDesc(task.desc);
      setPriority(task.priority);
      setCategory(task.category);
      setDue(task.due);
      setTags(task.tags.join(', '));
    }
  }, [task]);

  if (!task) return null;

  const handleSave = () => {
    const t = title.trim();
    if (!t) return;
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        ...task,
        title: t,
        desc: desc.trim(),
        priority,
        category,
        due,
        tags: tags.split(',').map(s => s.trim()).filter(Boolean),
      },
    });
    onClose();
  };

  const inputCls = 'w-full pl-9 pr-3 py-2.5 text-[14px] rounded-md border border-gray-200 dark:border-[#2C3350] bg-gray-50 dark:bg-[#1A1D27] text-gray-900 dark:text-[#E8EAF0] placeholder-gray-400 dark:placeholder-[#8090AA] outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-light)] transition-all font-sans';
  const labelCls = 'flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#B0BBCC] mb-1.5';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-[#1E2235] border border-gray-200 dark:border-[#2C3350] rounded-xl w-full max-w-[520px] p-7 shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 id="edit-modal-title" className="flex items-center gap-2 text-[17px] font-semibold text-gray-900 dark:text-[#E8EAF0]">
            <i className="ti ti-edit text-[19px] text-accent" aria-hidden="true" />
            Edit Task
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md border border-gray-200 dark:border-[#2C3350] bg-gray-50 dark:bg-[#252A3D] flex items-center justify-center text-gray-400 dark:text-[#8090AA] hover:bg-red-50 hover:border-red-300 hover:text-red-500 dark:hover:bg-[#3A1818] transition-all"
            aria-label="Close modal"
          >
            <i className="ti ti-x text-[16px]" aria-hidden="true" />
          </button>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className={labelCls} htmlFor="editTitle">
            <i className="ti ti-pencil text-[14px] text-accent" aria-hidden="true" />Task Title *
          </label>
          <div className="relative">
            <i className="ti ti-pencil absolute left-2.5 top-1/2 -translate-y-1/2 text-[15px] text-gray-400 dark:text-[#8090AA] pointer-events-none" aria-hidden="true" />
            <input id="editTitle" className={inputCls} value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Review and sign off on Q4 budget proposal" maxLength={120} required />
          </div>
          <p className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-[#8090AA] mt-1">
            <i className="ti ti-info-circle text-[12px]" />Verb-first title — "Draft", "Review", "Submit"
          </p>
        </div>

        {/* Desc */}
        <div className="mb-4">
          <label className={labelCls} htmlFor="editDesc">
            <i className="ti ti-align-left text-[14px] text-accent" aria-hidden="true" />Description
          </label>
          <textarea
            id="editDesc"
            rows={3}
            className="w-full px-3 py-2.5 text-[14px] rounded-md border border-gray-200 dark:border-[#2C3350] bg-gray-50 dark:bg-[#1A1D27] text-gray-900 dark:text-[#E8EAF0] placeholder-gray-400 dark:placeholder-[#8090AA] outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-light)] transition-all resize-y font-sans leading-relaxed"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="e.g. Check figures, confirm headcount, note blockers before final submission."
            maxLength={400}
          />
        </div>

        {/* Priority + Category */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className={labelCls} htmlFor="editPriority">
              <i className="ti ti-flag text-[14px] text-accent" aria-hidden="true" />Priority
            </label>
            <div className="relative">
              <i className="ti ti-flag absolute left-2.5 top-1/2 -translate-y-1/2 text-[15px] text-gray-400 dark:text-[#8090AA] pointer-events-none" aria-hidden="true" />
              <select id="editPriority" className={inputCls} value={priority} onChange={e => setPriority(e.target.value as Priority)}>
                <option value="high">High — urgent &amp; important</option>
                <option value="medium">Medium — important, not urgent</option>
                <option value="low">Low — nice to have</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls} htmlFor="editCategory">
              <i className="ti ti-apps text-[14px] text-accent" aria-hidden="true" />Category
            </label>
            <div className="relative">
              <i className="ti ti-apps absolute left-2.5 top-1/2 -translate-y-1/2 text-[15px] text-gray-400 dark:text-[#8090AA] pointer-events-none" aria-hidden="true" />
              <select id="editCategory" className={inputCls} value={category} onChange={e => setCategory(e.target.value as Category)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Due + Tags */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <label className={labelCls} htmlFor="editDue">
              <i className="ti ti-calendar text-[14px] text-accent" aria-hidden="true" />Due Date
            </label>
            <div className="relative">
              <i className="ti ti-calendar absolute left-2.5 top-1/2 -translate-y-1/2 text-[15px] text-gray-400 dark:text-[#8090AA] pointer-events-none" aria-hidden="true" />
              <input id="editDue" type="date" className={inputCls} value={due} onChange={e => setDue(e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls} htmlFor="editTags">
              <i className="ti ti-tags text-[14px] text-accent" aria-hidden="true" />Tags
            </label>
            <div className="relative">
              <i className="ti ti-tags absolute left-2.5 top-1/2 -translate-y-1/2 text-[15px] text-gray-400 dark:text-[#8090AA] pointer-events-none" aria-hidden="true" />
              <input id="editTags" className={inputCls} value={tags} onChange={e => setTags(e.target.value)}
                placeholder="e.g. finance, quarterly" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-md border border-gray-200 dark:border-[#2C3350] bg-white dark:bg-[#1E2235] text-gray-600 dark:text-[#B0BBCC] text-[13px] font-medium hover:bg-gray-50 dark:hover:bg-[#252A3D] transition-all"
          >
            <i className="ti ti-x text-[15px]" aria-hidden="true" />Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-md bg-accent text-white text-[13px] font-semibold hover:opacity-90 active:scale-[0.99] transition-all"
          >
            <i className="ti ti-device-floppy text-[15px]" aria-hidden="true" />Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
