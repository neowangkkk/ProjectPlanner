// ============================================================
// PROJECT ROSTER — edit this file to change what the planner shows
// ============================================================
//
// Each entry becomes one row in the planner. To revise a project's
// status, change its `currentPhase` and/or `currentStatus` below.
// Phases BEFORE `currentPhase` are auto-marked completed; phases
// AFTER are auto-marked not_started.
//
// Valid currentPhase values (in order):
//   'idea'             Idea Generation
//   'lit-review'       Literature Review
//   'rq'               Research Question
//   'theory'           Theory Development
//   'methodology'      Methodology Development
//   'data-collection'  Data Collection
//   'analysis'         Data Analysis
//   'writing'          Writing & Revision
//   'submission'       Submission / Under Review
//   'publication'      Decision / Publication
//
// Valid currentStatus values:
//   'not_started'   (gray)
//   'in_progress'   (amber)
//   'completed'     (green)
//
// After editing, clear the `academic-planner-projects` key in your
// browser's localStorage (DevTools → Application → Local Storage)
// so the planner re-reads this file on next load.
// ============================================================

export const PROJECTS_DATA = [
  {
    id: 'seed-agent-km',
    name: 'Agent_KM',
    venue: 'JMIS',
    description: 'CDMK theory — multi-agent coordination artifacts as organizational meta-knowledge',
    currentPhase: 'submission',
    currentStatus: 'in_progress',
    note: 'self-review to do, then submission',
  },
  {
    id: 'seed-empathy-education',
    name: 'Empathy_Education',
    venue: '10th EduTeach',
    description: 'ELM-based pedagogy for teaching empathy in AI design',
    currentPhase: 'lit-review',
    currentStatus: 'in_progress',
    note: 'Rejected from EduChi, revising for EduTeach',
  },
  {
    id: 'seed-empathy-taxonomy',
    name: 'Empathy_Interaction_Taxonomy',
    venue: 'ACII 2026',
    description: 'Asymmetric calibration of social support',
    currentPhase: 'analysis',
    currentStatus: 'in_progress',
    note: 'LLM scoring in progress',
  },
  {
    id: 'seed-agent-interaction',
    name: 'Agent-Interaction',
    venue: '',
    description: 'Topic changes to when agents interact',
    currentPhase: 'lit-review',
    currentStatus: 'in_progress',
    note: 'Drafting',
  },
  {
    id: 'seed-lt2024-paper1',
    name: 'LT2024_Paper1',
    venue: '',
    description: 'Parenting styles × personality × adolescent mental health (N=221 Toronto dyads)',
    currentPhase: 'writing',
    currentStatus: 'in_progress',
    note: 'Draft complete, revising now',
  },
  {
    id: 'seed-haas-replication',
    name: 'Haas_Replication',
    venue: '',
    description: 'Extended replication of Haas 2015; rework',
    currentPhase: 'writing',
    currentStatus: 'not_started',
    note: 'Revising with the decision under stress type ideas; writing not yet started',
  },
  {
    id: 'seed-empathy-appropriateness',
    name: 'Empathy_Appropriateness',
    venue: '',
    description: 'Signal-cost framework for LLM empathy appropriateness (IERG collaboration)',
    currentPhase: 'data-collection',
    currentStatus: 'in_progress',
    note: 'Phase 2 data analysis',
  },
  {
    id: 'seed-ai-governance',
    name: 'AI_Governance',
    venue: '',
    description: 'AI/GenAI policy appearance in university syllabi; 240 UofT courses sampled',
    currentPhase: 'data-collection',
    currentStatus: 'in_progress',
    note: 'Checking which syllabi are available',
  },
  {
    id: 'seed-workshop-yale',
    name: 'Workshop_Yale',
    venue: 'ACL/EMNLP Workshop',
    description: 'HAICE / Contrastive Norm Learning for empathy evaluation',
    currentPhase: 'methodology',
    currentStatus: 'in_progress',
    note: 'Framework drafted, waiting for update',
  },
  {
    id: 'seed-reddit-sustainability',
    name: 'Who_Still_Uses_Reddit',
    venue: '',
    description: 'Healthcare Q&A community sustainability post-LLM (r/AskDocs)',
    currentPhase: 'data-collection',
    currentStatus: 'not_started',
    note: 'Framework complete, data collection not yet started',
  },
  {
    id: 'seed-agile-shuna',
    name: 'Agile_Shuna',
    venue: "Master's thesis",
    description: 'Agile adoption in German automotive vs. Big Tech',
    currentPhase: 'writing',
    currentStatus: 'in_progress',
    note: 'Thesis —',
  },
  {
    id: 'seed-entrepreneurial-orientation',
    name: 'Entrepreneurial_Orientation',
    venue: 'Published 2025',
    description: 'Completed paper on entrepreneurial orientation',
    currentPhase: 'publication',
    currentStatus: 'completed',
    note: 'Published 2025',
  },
  {
    id: 'seed-digital-tech-firm-growth',
    name: 'Digital_Tech_Firm_Growth',
    venue: 'Under review',
    description: 'Digital technology and firm growth',
    currentPhase: 'submission',
    currentStatus: 'in_progress',
    note: 'Under review',
  },
];
