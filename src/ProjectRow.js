import React, { useState, forwardRef } from 'react';
import { PHASES, STATUS } from './constants';
import PhaseCell from './PhaseCell';

const ProjectRow = forwardRef(function ProjectRow({ project, onUpdate, onDelete, dragHandleProps, style, ...rest }, ref) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [venue, setVenue] = useState(project.venue);

  const completedCount = PHASES.filter(p => project.phases[p.id]?.status === STATUS.COMPLETED).length;
  const progressPct = Math.round((completedCount / PHASES.length) * 100);

  const saveEdit = () => {
    onUpdate({ ...project, name, description, venue });
    setEditing(false);
  };

  const cancelEdit = () => {
    setName(project.name);
    setDescription(project.description);
    setVenue(project.venue);
    setEditing(false);
  };

  const updatePhase = (phaseId, phaseData) => {
    onUpdate({
      ...project,
      phases: { ...project.phases, [phaseId]: phaseData },
    });
  };

  return (
    <tr ref={ref} {...rest} style={style} className="group border-b border-gray-100 hover:bg-white/60 transition-colors">
      {/* Project info - sticky left */}
      <td className="sticky left-0 z-10 bg-[#f8f7f4] group-hover:bg-[#f5f3ef] transition-colors min-w-[240px] max-w-[280px] p-3 border-r border-gray-200">
        <div className="flex items-start gap-2">
          {/* Drag handle */}
          <div {...dragHandleProps} className="mt-1 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <circle cx="3" cy="2" r="1.2"/><circle cx="9" cy="2" r="1.2"/>
              <circle cx="3" cy="6" r="1.2"/><circle cx="9" cy="6" r="1.2"/>
              <circle cx="3" cy="10" r="1.2"/><circle cx="9" cy="10" r="1.2"/>
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-2">
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-200"
                  autoFocus
                />
                <input
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <input
                  value={venue}
                  onChange={e => setVenue(e.target.value)}
                  placeholder="Target venue"
                  className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <div className="flex gap-1">
                  <button onClick={saveEdit} className="px-2 py-0.5 bg-gray-800 text-white text-xs rounded-md hover:bg-gray-700">Save</button>
                  <button onClick={cancelEdit} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-gray-200">Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">{project.name}</h3>
                  <button
                    onClick={() => setEditing(true)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity"
                    title="Edit project"
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L3.463 11.098a.25.25 0 00-.064.108l-.563 1.97 1.971-.564a.25.25 0 00.108-.064l8.61-8.61a.25.25 0 000-.353L12.427 2.488z"/>
                    </svg>
                  </button>
                </div>
                {project.description && (
                  <p className="text-xs text-gray-500 truncate mt-0.5">{project.description}</p>
                )}
                {project.venue && (
                  <span className="inline-block mt-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-medium rounded-md">
                    {project.venue}
                  </span>
                )}
                {/* Progress bar */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">{progressPct}%</span>
                </div>
              </div>
            )}

            {/* Delete button */}
            <button
              onClick={() => {
                if (window.confirm(`Delete "${project.name}"?`)) onDelete(project.id);
              }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
              title="Delete project"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/>
              </svg>
            </button>
          </div>
        </div>
      </td>

      {/* Phase cells */}
      {PHASES.map(phase => (
        <td key={phase.id} className="p-1.5 min-w-[120px]">
          <PhaseCell
            phaseData={project.phases[phase.id] || { status: 'not_started', targetDate: '', note: '' }}
            phaseLabel={phase.label}
            onUpdate={(data) => updatePhase(phase.id, data)}
          />
        </td>
      ))}
    </tr>
  );
});

export default ProjectRow;
