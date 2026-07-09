# Session Log

## Session — 2026-04-08

**Topics discussed:**
- Built a lightweight web app for tracking multiple academic paper projects across 10 research phases
- Implemented drag-and-drop reordering, phase status cycling, milestone tracking, filtering, and localStorage persistence
- Deployed the app to GitHub Pages

**Deliverables produced:**
- `src/App.js` — Main app component with project grid, filters, milestone banner, drag-and-drop
- `src/ProjectRow.js` — Project row with inline editing, progress bar, delete
- `src/PhaseCell.js` — Phase cell with status cycling, popover for date/notes
- `src/constants.js` — Phase definitions, status enums, project factory
- `src/useLocalStorage.js` — Custom hook for persistent state
- `src/index.css` — Tailwind directives and custom scrollbar styles
- `tailwind.config.js` — Tailwind configuration with academic fonts
- `package.json` — Added gh-pages deploy scripts and homepage field

**Decisions made:**
- Tech stack: React + Tailwind CSS + react-beautiful-dnd
- Data persistence via localStorage (no backend)
- Deployed to GitHub Pages at https://neowangkkk.github.io/ProjectPlanner

**Next steps:**
- Commit source code to main branch (only `gh-pages` branch was pushed so far)
- Consider adding export/import functionality for data backup
- Optional: add dark mode, mobile responsiveness improvements

---
