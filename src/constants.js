export const PHASES = [
  { id: 'idea', label: 'Idea Generation', short: 'Idea' },
  { id: 'lit-review', label: 'Literature Review', short: 'Lit Review' },
  { id: 'rq', label: 'Research Question', short: 'RQ' },
  { id: 'theory', label: 'Theory Development', short: 'Theory' },
  { id: 'methodology', label: 'Methodology Development', short: 'Method' },
  { id: 'data-collection', label: 'Data Collection', short: 'Data Coll.' },
  { id: 'analysis', label: 'Data Analysis', short: 'Analysis' },
  { id: 'writing', label: 'Writing & Revision', short: 'Writing' },
  { id: 'submission', label: 'Submission / Under Review', short: 'Submission' },
  { id: 'publication', label: 'Decision / Publication', short: 'Publication' },
];

export const STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

export const STATUS_COLORS = {
  not_started: { bg: 'bg-gray-100', border: 'border-gray-200', text: 'text-gray-400', dot: 'bg-gray-300' },
  in_progress: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', dot: 'bg-amber-400' },
  completed: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

export function createProject(name = 'New Project') {
  const phases = {};
  PHASES.forEach(p => {
    phases[p.id] = { status: STATUS.NOT_STARTED, targetDate: '', note: '' };
  });
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2),
    name,
    description: '',
    venue: '',
    phases,
    createdAt: new Date().toISOString(),
  };
}
