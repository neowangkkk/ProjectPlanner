import { PHASES, STATUS } from './constants';
import { PROJECTS_DATA } from './projectsData';

function buildProject(entry) {
  const phases = {};
  let reachedCurrent = false;
  PHASES.forEach(p => {
    if (p.id === entry.currentPhase) {
      phases[p.id] = { status: entry.currentStatus, targetDate: '', note: entry.note || '' };
      reachedCurrent = true;
    } else if (!reachedCurrent) {
      phases[p.id] = { status: STATUS.COMPLETED, targetDate: '', note: '' };
    } else {
      phases[p.id] = { status: STATUS.NOT_STARTED, targetDate: '', note: '' };
    }
  });
  return {
    id: entry.id,
    name: entry.name,
    description: entry.description || '',
    venue: entry.venue || '',
    phases,
    createdAt: '2026-04-15T00:00:00.000Z',
  };
}

export const SEED_PROJECTS = PROJECTS_DATA.map(buildProject);
