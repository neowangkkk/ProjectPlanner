import React, { useState } from 'react';
import { getScriptUrl, setScriptUrl } from './useGoogleSheet';

export default function SyncStatus({ syncStatus, lastError, forceSync }) {
  const [showSetup, setShowSetup] = useState(false);
  const [url, setUrl] = useState(getScriptUrl);

  const hasUrl = !!getScriptUrl();

  const statusConfig = {
    idle: { color: 'text-gray-400', bg: 'bg-gray-100', label: 'Local only' },
    syncing: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Syncing...' },
    synced: { color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Synced' },
    error: { color: 'text-red-600', bg: 'bg-red-50', label: 'Sync error' },
  };

  const status = statusConfig[syncStatus] || statusConfig.idle;

  const handleSave = () => {
    setScriptUrl(url.trim());
    setShowSetup(false);
    window.location.reload();
  };

  const handleDisconnect = () => {
    setScriptUrl('');
    setUrl('');
    setShowSetup(false);
    window.location.reload();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowSetup(!showSetup)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium ${status.bg} ${status.color} border border-current/10 hover:opacity-80 transition-opacity`}
        title={lastError || status.label}
      >
        {syncStatus === 'syncing' ? (
          <svg className="animate-spin" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="8" cy="8" r="6" strokeOpacity="0.3" />
            <path d="M8 2a6 6 0 014.243 10.243" />
          </svg>
        ) : syncStatus === 'synced' ? (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
          </svg>
        ) : syncStatus === 'error' ? (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM7.25 5a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0V5zm.75 7a1 1 0 110-2 1 1 0 010 2z"/>
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 2a6 6 0 100 12A6 6 0 008 2zm0 1a5 5 0 110 10A5 5 0 018 3z"/>
          </svg>
        )}
        {hasUrl ? status.label : 'Connect Sheet'}
      </button>

      {showSetup && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">Google Sheets Sync</h3>
          <p className="text-xs text-gray-500 mb-3">
            Paste your Google Apps Script web app URL to sync data with a Google Sheet.
          </p>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/.../exec"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200 mb-3"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={!url.trim()}
              className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {hasUrl ? 'Update & Reconnect' : 'Connect'}
            </button>
            {hasUrl && (
              <button
                onClick={handleDisconnect}
                className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100"
              >
                Disconnect
              </button>
            )}
            {hasUrl && syncStatus !== 'syncing' && (
              <button
                onClick={() => { forceSync(); setShowSetup(false); }}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-100"
              >
                Force Sync
              </button>
            )}
            <button
              onClick={() => setShowSetup(false)}
              className="ml-auto px-3 py-1.5 text-gray-500 text-xs hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
          {lastError && (
            <p className="mt-2 text-xs text-red-500">Error: {lastError}</p>
          )}

          {/* Setup instructions */}
          <details className="mt-3 text-xs text-gray-500">
            <summary className="cursor-pointer hover:text-gray-700 font-medium">Setup instructions</summary>
            <ol className="mt-2 space-y-1.5 list-decimal list-inside">
              <li>Create a new Google Sheet</li>
              <li>Go to <strong>Extensions &gt; Apps Script</strong></li>
              <li>Replace the code with the script from <code>google-apps-script.js</code></li>
              <li>Click <strong>Deploy &gt; New deployment</strong></li>
              <li>Choose <strong>Web app</strong>, set access to <strong>Anyone</strong></li>
              <li>Copy the URL and paste it above</li>
            </ol>
          </details>
        </div>
      )}
    </div>
  );
}
