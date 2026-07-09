import React, { useState } from 'react';
import { STATUS, STATUS_COLORS } from './constants';

const statusCycle = [STATUS.NOT_STARTED, STATUS.IN_PROGRESS, STATUS.COMPLETED];

export default function PhaseCell({ phaseData, phaseLabel, onUpdate }) {
  const [showPopover, setShowPopover] = useState(false);
  const [note, setNote] = useState(phaseData.note || '');
  const [targetDate, setTargetDate] = useState(phaseData.targetDate || '');

  const colors = STATUS_COLORS[phaseData.status];

  const cycleStatus = (e) => {
    e.stopPropagation();
    const idx = statusCycle.indexOf(phaseData.status);
    const next = statusCycle[(idx + 1) % statusCycle.length];
    onUpdate({ ...phaseData, status: next });
  };

  const isOverdue = phaseData.targetDate &&
    phaseData.status !== STATUS.COMPLETED &&
    new Date(phaseData.targetDate) < new Date(new Date().toDateString());

  const saveDetails = () => {
    onUpdate({ ...phaseData, note, targetDate });
    setShowPopover(false);
  };

  return (
    <div className="relative">
      <div
        className={`${colors.bg} ${colors.border} border rounded-lg p-2 min-h-[64px] cursor-pointer
          transition-all duration-150 hover:shadow-md hover:scale-[1.02] group`}
        onClick={() => setShowPopover(!showPopover)}
      >
        {/* Status dot + click to cycle */}
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={cycleStatus}
            className={`w-3.5 h-3.5 rounded-full ${colors.dot} hover:ring-2 ring-offset-1 ring-gray-400 transition-all`}
            title="Click to cycle status"
          />
          {phaseData.targetDate && (
            <span className={`text-[10px] font-medium ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
              {isOverdue && '⚠ '}{new Date(phaseData.targetDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
        {phaseData.note && (
          <p className={`text-[11px] ${colors.text} leading-tight line-clamp-2`}>
            {phaseData.note}
          </p>
        )}
        {!phaseData.note && !phaseData.targetDate && (
          <p className="text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
            Click to add details
          </p>
        )}
      </div>

      {/* Popover for editing */}
      {showPopover && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => { saveDetails(); }} />
          <div className="absolute z-40 top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-64"
            onClick={e => e.stopPropagation()}>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{phaseLabel}</h4>

            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <div className="flex gap-2 mb-3">
              {statusCycle.map(s => (
                <button
                  key={s}
                  onClick={() => onUpdate({ ...phaseData, status: s, note, targetDate })}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all
                    ${phaseData.status === s
                      ? `${STATUS_COLORS[s].bg} ${STATUS_COLORS[s].border} ${STATUS_COLORS[s].text} ring-2 ring-offset-1 ring-gray-300`
                      : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}
                >
                  {s === STATUS.NOT_STARTED ? 'Not Started' : s === STATUS.IN_PROGRESS ? 'In Progress' : 'Completed'}
                </button>
              ))}
            </div>

            <label className="block text-xs font-medium text-gray-600 mb-1">Target Date</label>
            <input
              type="date"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

            <label className="block text-xs font-medium text-gray-600 mb-1">Note</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
              placeholder="e.g., finish regression model"
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

            <button
              onClick={saveDetails}
              className="mt-3 w-full bg-gray-800 text-white text-xs font-medium py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Save
            </button>
          </div>
        </>
      )}
    </div>
  );
}
