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
