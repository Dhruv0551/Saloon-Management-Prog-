# AGENTS.md — Salon Queue Management System Guidelines

## 1. Project Summary
A luxury, bilingual (English & Gujarati) real-time digital queue management web application for salons, enabling remote customer check-in, barber chair coordination, live status tracking, and waiting-area TV broadcasting.

---

## 2. Technology Stack & Commands

### 2.1 Core Stack
- **Frontend Framework**: React 18 / 19 with Vite
- **Routing**: React Router DOM (v6 / v7)
- **Styling**: Tailwind CSS with custom salon theme extensions
- **Icons**: Lucide React
- **Audio Effects**: Web Audio API / subtle synthesized audio chimes for TV and status alerts
- **Language / i18n**: Custom lightweight bilingual translation dictionaries (`en.json` & `gu.json`) with React Context
- **Deployment Targets**:
  - Frontend: Vercel
  - Backend / Sync Server (if hosted): Render or Railway / Supabase
  - Source Control: GitHub (`main` branch)

### 2.2 Standard Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run type check & linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 3. Mandatory Documentation References
Before writing, modifying, or testing any feature, the AI coding agent **must** read and adhere to:
1. [`docs/01-brief.md`](file:///docs/01-brief.md) — Problem statement, user personas, must-have features, explicit exclusions, and design identity.
2. [`docs/02-screens.md`](file:///docs/02-screens.md) — Exact UI specifications, layouts, button behaviors, and edge states for all 7 screens:
   - Screen 1: Home (`/`)
   - Screen 2: Join Queue (`/join`)
   - Screen 3: My Status (`/status/:id`)
   - Screen 4: Reception Dashboard (`/reception`)
   - Screen 5: Barber View (`/barber/:name`)
   - Screen 6: Waiting Area TV (`/display`)
   - Screen 7: Owner Settings (`/admin`)
3. [`docs/03-flows-rules.md`](file:///docs/03-flows-rules.md) — State machine lifecycle (`Waiting → Called → In Chair → Done`, `Cancelled`, `No-show`), barber assignment logic, dynamic wait-time formulas, and 14 test cases.

---

## 4. Proposed Storage & Synchronization Architecture

### 4.1 Requirement Analysis
The system connects physically separated hardware:
- Customer personal smartphones (remote cellular/home Wi-Fi)
- Receptionist tablet (salon counter Wi-Fi)
- Barber mobile stations (chair-side Wi-Fi/cellular)
- Waiting-area smart TV or display PC (HDMI/browser)

Single-browser mechanisms like `localStorage` alone cannot synchronize different physical devices. Therefore, the data store and state transitions must be centralized and synchronized in < 5 seconds.

### 4.2 Proposed Unified Queue Architecture
1. **Centralized Domain Logic (`src/core/queueEngine.ts`)**:
   - Pure functions enforcing state transitions, FIFO ordering, barber eligibility matching, and wait-time math.
   - No screen implements its own state transition rules; all dispatch actions through this centralized engine.
2. **Dual-Mode Data & Sync Layer (`src/services/queueSync.ts`)**:
   - **Local / Single-Machine Mode (Zero-Config Development & Cross-Tab Testing)**:
     - Uses `localStorage` for state persistence combined with modern browser `BroadcastChannel` API.
     - Allows instant (< 50ms) cross-tab synchronization across multiple browser windows (e.g., Tab 1: `/`, Tab 2: `/reception`, Tab 3: `/display`, Tab 4: `/barber/ravi`) without requiring external internet infrastructure during initial development.
   - **Network Multi-Device Mode (Production Deployment)**:
     - A lightweight Node.js/Express server with WebSockets (or Server-Sent Events / REST polling every 2–3s) deployed on Render/Railway, OR a managed serverless real-time service (Supabase Realtime / Firebase Firestore).
     - Provides instant sub-second synchronization across separate phones, tablets, and TV screens worldwide.

---

## 5. Coding & Design Guidelines

### 5.1 Color Palette & Theme Tokens
- **Dark Charcoal Surface**: `#1F2937` (`bg-charcoal` / `bg-gray-800`)
- **Deep Dark Canvas**: `#111827` (`bg-canvas` / `bg-gray-900`)
- **Luxury Gold Accents**: `#D4A017` / `#F59E0B` (`text-gold`, `border-gold`, `bg-gold`)
- **Crisp High-Contrast Text**: `#FFFFFF` (`text-white`)
- **Muted Supporting Text**: `#9CA3AF` (`text-gray-400`)
- **Success / Available**: `#10B981` (Emerald green)
- **Warning / Alert**: `#F59E0B` (Amber)
- **Danger / Error**: `#EF4444` (Red)

### 5.2 Accessibility & Mobile Standards
- Minimum touch target size: **44px × 44px** on all clickable buttons, pills, and inputs.
- High contrast: Text colors must meet WCAG AA standards against dark charcoal backgrounds.
- Large TV Typography: Screen 6 (`/display`) uses bold, scalable font sizes readable from 5 meters away.

### 5.3 Bilingual Localization Rules
- Every user-facing string must be loaded from `src/i18n/translations/en.json` and `src/i18n/translations/gu.json`.
- **Never hardcode English or Gujarati text directly in UI components.**
- Centralized language context provides a `t(key, params)` helper and `language` toggle state (`'en' | 'gu'`).
- Ensure all Gujarati translations fit cleanly without overflow or broken card borders.

---

## 6. Strict AI Coding Agent Working Rules

1. **One Screen or Feature at a Time**: Never attempt to build the whole app at once. Implement sequentially according to the roadmap.
2. **No Unrelated Modifications**: Never modify unrelated screens or components while working on a specific task.
3. **Documentation Precedence**: Always read the specifications in `docs/` before implementing any feature.
4. **Single Source of Truth**: Keep queue management state and calculation logic in `src/core/` and `src/services/`. Do not duplicate logic in UI components.
5. **No Excluded Features**:
   - Do NOT build online payments.
   - Do NOT build future appointments/calendars.
   - Do NOT build SMS or WhatsApp integrations.
   - Do NOT build customer loyalty programs.
   - Do NOT build multi-branch features.
6. **Report Format After Every Step**:
   - Files created or modified
   - Features implemented
   - Exact steps to test the changes
   - Any remaining issues or edge cases observed
7. **Frequent Git Commits & Pushes**: Commit working code after each development milestone and push to GitHub origin.
8. **Keep `prompts.md` Updated**: Log each prompt and key milestone chronologically in `prompts.md`.
