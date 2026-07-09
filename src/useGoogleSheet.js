import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'academic-planner-projects';
const SCRIPT_URL_KEY = 'academic-planner-script-url';

function getLocalData(fallback) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

export function getScriptUrl() {
  return localStorage.getItem(SCRIPT_URL_KEY) || '';
}

export function setScriptUrl(url) {
  localStorage.setItem(SCRIPT_URL_KEY, url);
}

export function useGoogleSheet(initialValue = []) {
  const [projects, setProjects] = useState(() => getLocalData(initialValue));
  const [syncStatus, setSyncStatus] = useState('idle'); // idle | syncing | synced | error
  const [lastError, setLastError] = useState(null);
  const saveTimer = useRef(null);
  const isInitialLoad = useRef(true);

  // Fetch from Google Sheets on mount
  useEffect(() => {
    const url = getScriptUrl();
    if (!url) {
      isInitialLoad.current = false;
      return;
    }

    setSyncStatus('syncing');
    fetch(`${url}?action=get`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok' && Array.isArray(data.projects)) {
          if (data.projects.length > 0) {
            setProjects(data.projects);
            setLocalData(data.projects);
          }
          setSyncStatus('synced');
          setLastError(null);
        } else if (data.status === 'ok') {
          // Sheet is empty, push local data
          setSyncStatus('synced');
        } else {
          throw new Error(data.message || 'Unknown error');
        }
      })
      .catch(err => {
        console.warn('Failed to load from Google Sheets:', err);
        setSyncStatus('error');
        setLastError(err.message);
      })
      .finally(() => {
        isInitialLoad.current = false;
      });
  }, []);

  // Save to Google Sheets (debounced) whenever projects change
  useEffect(() => {
    // Always save to localStorage immediately
    setLocalData(projects);

    // Skip the initial load
    if (isInitialLoad.current) return;

    const url = getScriptUrl();
    if (!url) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(() => {
      setSyncStatus('syncing');
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'save', projects }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'ok') {
            setSyncStatus('synced');
            setLastError(null);
          } else {
            throw new Error(data.message || 'Save failed');
          }
        })
        .catch(err => {
          console.warn('Failed to save to Google Sheets:', err);
          setSyncStatus('error');
          setLastError(err.message);
        });
    }, 1500);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [projects]);

  const update = useCallback((updater) => {
    setProjects(prev => typeof updater === 'function' ? updater(prev) : updater);
  }, []);

  const forceSync = useCallback(() => {
    const url = getScriptUrl();
    if (!url) return;

    setSyncStatus('syncing');
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'save', projects }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok') {
          setSyncStatus('synced');
          setLastError(null);
        } else {
          throw new Error(data.message || 'Sync failed');
        }
      })
      .catch(err => {
        setSyncStatus('error');
        setLastError(err.message);
      });
  }, [projects]);

  return [projects, update, { syncStatus, lastError, forceSync }];
}
