# Prompts Log — Salon Queue Management System

This document maintains a chronological record of all user prompts and instructions provided to the AI agent during the development of the Salon Queue Management System.

---

## Prompt 1: Initial Requirements & Task Setup
**Date & Time**: 2026-11-24T16:34:26+05:30  
**Status**: In Progress / First Milestone Completed  

### Prompt Content:
> # Salon Queue Management System — Master Vibe Coding Prompt
> Build a polished, responsive Salon Queue Management System using the requirements and workflow below.
> 
> Follow the documentation-first approach strictly. Do not attempt to build the entire application in one go.
> 
> [Sections 1 to 10 provided system requirements, tech stack, design system, 7 screens, queue rules, and development roadmap.]
> 
> ## 11. First Task — Do Not Build the Application Yet
> Start by doing ONLY the following:
> 1. Understand the project requirements.
> 2. Create the project folder structure.
> 3. Create `docs/01-brief.md`.
> 4. Create `docs/02-screens.md`.
> 5. Create `docs/03-flows-rules.md`.
> 6. Create `AGENTS.md`.
> 7. Review all four documents for consistency.
> 
> Do not write frontend or backend application code yet.
> 
> After creating the documents, show me:
> - The project folder structure
> - The contents of all four documents
> - Any assumptions or unclear requirements
> 
> **Stop and wait for my approval before proceeding to Step 1 of the development roadmap.**
> 
> the repo is connected to github, push the code frequently

### Agent Actions Taken:
1. Created `docs/01-brief.md` specifying problem statement, user personas, 8 core features, explicit exclusions, and visual design direction.
2. Created `docs/02-screens.md` specifying complete UI hierarchy, button behaviors, responsive layouts, empty/loading/error states for all seven screens (`/`, `/join`, `/status/:id`, `/reception`, `/barber/:name`, `/display`, `/admin`).
3. Created `docs/03-flows-rules.md` establishing remote/walk-in customer workflows, strict non-reversible state machine, FIFO & preference assignment algorithms, dynamic wait-time math, no-show/cancellation rules, and 14 comprehensive test cases.
4. Created `AGENTS.md` containing project summary, tech stack, coding/design guidelines, proposed dual-mode storage & synchronization architecture, and strict agent working rules.
5. Prepared folder structure and staged files for git commit and remote push.


---

## Prompt 2: English-Only Documentation & Approval to Proceed
**Date & Time**: 2026-11-24T16:44:26+05:30  
**Status**: Completed  

### Prompt Content:
> go further and write the documentation in english only

### Agent Actions Taken:
1. Updated all documentation (`docs/01-brief.md`, `docs/02-screens.md`, `docs/03-flows-rules.md`, `AGENTS.md`, and `README.md`) to be strictly in English only.
2. Commenced Step 1 of the development roadmap:
   - Summarized the application in 8 bullet points and noted clarifications.
   - Initialized React + Vite + Tailwind CSS project with React Router DOM and Lucide React.
   - Configured the salon color theme (charcoal, canvas, gold, white, muted grey).
   - Created routing and skeleton placeholder pages for all 7 screens.
   - Established the bilingual i18n context (`en.json` and `gu.json`) and header language toggle.


---

## Prompt 3: English Only, Separate Frontend/Backend Dirs, New Bespoke Theme, High Commit Frequency, Step 2
**Date & Time**: 2026-11-24T17:05:04+05:30  
**Status**: In Progress  

### Prompt Content:
> the website should solely be in english, now step 2, also do classify frontend in a separate frontend directory and backend in backend on, the color theme is very generic, try something different and keep commiting after every samll change i need more commits

### Agent Actions Planned:
1. Reorganize repository structure into separate `frontend/` and `backend/` directories.
2. Remove bilingual switcher and Gujarati dictionary; standardize entirely on refined English.
3. Replace generic gray/gold theme with a luxury Velvet Obsidian & Champagne Rose Gold design system with glassmorphic cards and warm bronze accents.
4. Implement Centralized Queue Engine and Local Synchronization Layer.
5. Fully implement Screen 1 (Home) with live barber cards, status indicators, and queue metrics.
6. Fully implement Screen 2 (Join Queue) with 10-digit validation, 3-service limit, barber selection, live duration/price calculation, and token generation.
7. Execute atomic git commits after each individual change and push frequently.


---

## Prompt 4: Proceed With Every Step
**Date & Time**: 2026-11-24T20:21:41+05:30  
**Status**: In Progress  

### Prompt Content:
> ok proceed with every step

### Agent Actions Planned:
- Execute Step 3: My Status screen with live audio chime, position #2 alert, and full-screen takeover modal when Called.
- Execute Step 4: Full Reception Dashboard with interactive barber chair management, Call Next, Walk-in modal, No-show (>10m), Cancel, and >60m wait highlighting.
- Execute Step 5: Barber Mobile View with live elapsed stopwatch, Start / Done actions, and Break controls; and Waiting Area TV Display with 5m legible typography, upcoming 5 tokens, gold pulsing, and Web Audio API synthesizer.
- Execute Step 6: Owner Admin screen with Queue Open/Close, Service Catalog CRUD, Barber Shifts, and Daily KPI Metrics.
- Execute Step 7: Rules & Edge Case verification (30-min closing cutoff, duplicate phone prevention, break handling).
- Execute Step 8: Comprehensive test checklist execution.
- Execute Step 9: Final production build, README credentials, and project reflection.
- Commit atomically and push after each step.
