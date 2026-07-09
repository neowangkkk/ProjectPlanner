import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PHASES, STATUS, createProject } from './constants';
import { useGoogleSheet } from './useGoogleSheet';
import { SEED_PROJECTS } from './seedProjects';
import ProjectRow from './ProjectRow';
import SyncStatus from './SyncStatus';

function App() {
  const [projects, setProjects, { syncStatus, lastError, forceSync }] = useGoogleSheet(SEED_PROJECTS);
  const [filterPhase, setFilterPhase] = useState('all');
  const [filterVenue, setFilterVenue] = useState('all');

  const venues = useMemo(() => {
    const set = new Set(projects.map(p => p.venue).filter(Boolean));
    return Array.from(set).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter(p => {
      if (filterPhase !== 'all') {
        const currentPhase = PHASES.find(ph => p.phases[ph.id]?.status === STATUS.IN_PROGRESS);
        if (!currentPhase || currentPhase.id !== filterPhase) return false;
      }
      if (filterVenue !== 'all' && p.venue !== filterVenue) return false;
      return true;
    });
  }, [projects, filterPhase, filterVenue]);

  const addProject = () => {
    setProjects(prev => [...prev, createProject()]);
  };

  const resetToDefaults = () => {
    const ok = window.confirm(
      'Replace all current projects with the roster from projectsData.js? This cannot be undone.'
    );
    if (ok) setProjects(SEED_PROJECTS);
  };

  const updateProject = (updated) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(projects);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setProjects(items);
  };

  // Summary stats
  const totalProjects = projects.length;
  const upcomingMilestones = projects.reduce((acc, p) => {
    PHASES.forEach(ph => {
      const data = p.phases[ph.id];
      if (data?.targetDate && data.status !== STATUS.COMPLETED) {
        const date = new Date(data.targetDate + 'T00:00:00');
        const now = new Date();
        const diff = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
        if (diff >= 0 && diff <= 14) {
          acc.push({ project: p.name, phase: ph.short, date: data.targetDate, daysLeft: diff });
        }
      }
    });
    return acc;
  }, []).sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-900 tracking-tight">
                Academic Project Planner
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {totalProjects} project{totalProjects !== 1 ? 's' : ''} tracked
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Filters */}
              <select
                value={filterPhase}
                onChange={e => setFilterPhase(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="all">All Phases</option>
                {PHASES.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
              {venues.length > 0 && (
                <select
                  value={filterVenue}
                  onChange={e => setFilterVenue(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="all">All Venues</option>
                  {venues.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              )}
              <SyncStatus syncStatus={syncStatus} lastError={lastError} forceSync={forceSync} />
              <button
                onClick={resetToDefaults}
                title="Replace all projects with the roster defined in projectsData.js"
                className="text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-lg px-3 py-1.5 bg-white transition-colors"
              >
                Reset to roster
              </button>
              <button
                onClick={addProject}
                className="flex items-center gap-1.5 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z"/>
                </svg>
                New Project
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Upcoming milestones banner */}
      {upcomingMilestones.length > 0 && (
        <div className="max-w-[1800px] mx-auto px-6 mt-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <h3 className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">
              Upcoming Milestones (next 14 days)
            </h3>
            <div className="flex flex-wrap gap-3">
              {upcomingMilestones.slice(0, 8).map((m, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 bg-white/70 border border-amber-200 rounded-lg px-2.5 py-1 text-xs">
                  <span className={`font-semibold ${m.daysLeft <= 3 ? 'text-red-600' : 'text-amber-700'}`}>
                    {m.daysLeft === 0 ? 'Today' : m.daysLeft === 1 ? 'Tomorrow' : `${m.daysLeft}d`}
                  </span>
                  <span className="text-gray-600">{m.project}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-500">{m.phase}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main grid */}
      <main className="max-w-[1800px] mx-auto px-6 py-6">
        {projects.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
              </svg>
            </div>
            <h2 className="font-serif text-xl font-bold text-gray-800 mb-1">No projects yet</h2>
            <p className="text-sm text-gray-500 mb-4">Create your first academic project to start tracking progress</p>
            <button
              onClick={addProject}
              className="inline-flex items-center gap-1.5 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z"/>
              </svg>
              Create First Project
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white/40">
            <DragDropContext onDragEnd={onDragEnd}>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="sticky top-[73px] z-20">
                    <th className="sticky left-0 z-30 bg-gray-50 border-b border-r border-gray-200 p-3 text-left min-w-[240px]">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</span>
                    </th>
                    {PHASES.map((phase, i) => (
                      <th key={phase.id} className="bg-gray-50 border-b border-gray-200 p-2 min-w-[120px]">
                        <div className="text-center">
                          <span className="text-[10px] text-gray-400 font-medium">{i + 1}</span>
                          <p className="text-xs font-semibold text-gray-600 leading-tight mt-0.5">{phase.short}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <Droppable droppableId="projects">
                  {(provided) => (
                    <tbody ref={provided.innerRef} {...provided.droppableProps}>
                      {filtered.map((project, index) => (
                        <Draggable key={project.id} draggableId={project.id} index={index}>
                          {(provided, snapshot) => (
                            <ProjectRow
                              project={project}
                              onUpdate={updateProject}
                              onDelete={deleteProject}
                              dragHandleProps={provided.dragHandleProps}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={{
                                ...provided.draggableProps.style,
                                ...(snapshot.isDragging ? { background: '#fefefe', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } : {}),
                              }}
                            />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </tbody>
                  )}
                </Droppable>
              </table>
            </DragDropContext>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-[1800px] mx-auto px-6 pb-8">
        <p className="text-xs text-gray-400 text-center">
          Data saved locally &amp; synced to Google Sheets when connected
        </p>
      </footer>
    </div>
  );
}

export default App;
