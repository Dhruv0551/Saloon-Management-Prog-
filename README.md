# Salon Queue Management System (Luxe Salon)

**Live demo:** [https://saloon-management-prog.vercel.app](https://saloon-management-prog.vercel.app) *(Deployable to Vercel via GitHub integration)*

**Hosted on:** Vercel (Frontend SPA) & Render / Railway (Real-time Synchronization Service)

**Staff Access Information:**
- Reception Dashboard: Direct access at `/reception`
- Stylist Chair Stations: `/barber/ravi`, `/barber/amit`, `/barber/imran`
- Owner Admin Panel: Direct access at `/admin`
- Waiting Area TV Display: `/display` (Supports Fullscreen & Web Audio Chime)

---

## 1. Project Overview & Architecture

A digital queue management web application for modern salons, enabling remote smartphone check-in, real-time barber chair coordination, live customer position countdowns, and ambient waiting-area TV broadcasting.

The repository is organized into distinct environments:
- **`frontend/`**: React 18, Vite, Tailwind CSS with custom **Velvet Obsidian & Champagne Rose Gold** luxury styling, Lucide React icons, and Web Audio API synthesized chimes.
- **`backend/`**: Lightweight Node.js/Express service for network multi-device synchronization across customer phones, reception tablets, and wall-mounted TV displays.
- **`docs/`**: Comprehensive specifications:
  - [`docs/01-brief.md`](docs/01-brief.md) — Problem statement, personas, must-haves, exclusions.
  - [`docs/02-screens.md`](docs/02-screens.md) — Detailed UI hierarchy & button interactions for all 7 screens.
  - [`docs/03-flows-rules.md`](docs/03-flows-rules.md) — State machine lifecycle, FIFO & barber matching logic, 14 test cases.

---

## 2. Seven Dedicated Screens

| Screen | Route | Target User & Purpose |
|---|---|---|
| **Screen 1: Home** | `/` | Arriving customers: Live queue density, wait time, stylist availability cards. |
| **Screen 2: Join Queue** | `/join` | Remote clients: 10-digit phone validation, max 3 service selection, barber preference, live pricing summary. |
| **Screen 3: My Status** | `/status/:id` | Live customer spot: Position countdown, ~wait mins, Position #2 "Start Coming" alert, full-screen "It's Your Turn!" takeover modal, and cancellation. |
| **Screen 4: Reception Dashboard** | `/reception` | Landscape tablet: Chair timers, Call Next (FIFO matching), No-show handler, Cancel, + Add Walk-in modal, >60m wait highlights. |
| **Screen 5: Barber View** | `/barber/:name` | Mobile station for Ravi, Amit, Imran: Massive 52px buttons, elapsed service stopwatch, Start Service, Done, and Break controls. |
| **Screen 6: Waiting Area TV** | `/display` | Wall TV display: High-contrast 5-meter legible typography, now-serving tokens, upcoming 5 queue tokens, and 12s gold flashing with chime. |
| **Screen 7: Owner Settings** | `/admin` | Salon management: Master Queue Open/Close switch, stylist shift toggles, service catalog CRUD, and daily statistics. |

---

## 3. Standard Run & Development Commands

### Frontend
```bash
cd frontend
npm install
npm run dev     # Starts Vite dev server at http://localhost:5173
npm run build   # Production type-check & build
npm run lint    # TypeScript strict linting
```

### Backend
```bash
cd backend
npm install
npm run dev     # Runs sync server on port 4000
```

---

## 4. Quality Assurance Test Verification Matrix

All 14 test cases specified in `docs/03-flows-rules.md` have been verified:

| Test ID | Scenario | Verification Method | Result |
|---|---|---|---|
| **TC-01** | Standard Remote Registration | Validated 10-digit phone, service selection, and sequential token generation (`S-15`). | **PASS** |
| **TC-02** | Duplicate Phone Prevention | Attempted registration with phone already active in queue; blocked with error notice. | **PASS** |
| **TC-03** | Max 3 Services Enforced | Service selection chips automatically prevent selecting a 4th service with visual counter. | **PASS** |
| **TC-04** | Specific Barber Assignment | Barber "Amit" clicks "Call Next" and correctly skips customers waiting specifically for Ravi. | **PASS** |
| **TC-05** | Any Barber First Available | Customers with "Any Barber" preference are matched to the earliest free barber chair. | **PASS** |
| **TC-06** | Stage 1 "Start Coming" Alert | When queue position decreases to #2, amber travel banner renders on `/status/:id`. | **PASS** |
| **TC-07** | Stage 2 "It's Your Turn" Alert | When status transitions to `Called`, full-screen gold modal take-over and Web Audio chime activate. | **PASS** |
| **TC-08** | No-show Trigger & Reset | Receptionist marks unarrived client as No-show; frees up chair and allows rejoining. | **PASS** |
| **TC-09** | Customer Self-Cancellation | Customer taps "Cancel My Spot" with confirmation modal; removes spot and shifts queue up. | **PASS** |
| **TC-10** | TV Display Flashing & Audio | Newly called tokens trigger gold pulsing animation on `/display` and play a two-tone chime. | **PASS** |
| **TC-11** | Barber Break Handling | Barber toggles "On Break"; excluded from wait-time math and disabled in dispatch. | **PASS** |
| **TC-12** | 30-min Cutoff & Admin Toggle | Remote check-in auto-closes 30 minutes before closing time or via master admin switch. | **PASS** |
| **TC-13** | English Theme Consistency | All screens adhere to pure English labels and Velvet Obsidian & Champagne Rose Gold design. | **PASS** |
| **TC-14** | Non-Reversible Lifecycle | Strict progression `Waiting → Called → In Chair → Done` strictly maintained by state engine. | **PASS** |

---

## 5. Half-Page Development Reflection

### Challenge Encountered
During early development, the initial implementation bundled the frontend directly at the repository root and utilized a generic charcoal/gold color scheme with mixed English and Gujarati localization strings directly embedded in various UI screens. Additionally, cross-tab synchronization needed to ensure that customer smartphones, tablet reception dashboards, barber chair stations, and the TV display stay updated within sub-second intervals without race conditions.

### Identification
When testing across multiple browser windows, language inconsistencies emerged where some badges fell back to mixed dictionary strings, and the visual aesthetics felt identical to standard dark-mode templates rather than reflecting a bespoke, luxury grooming salon. Furthermore, the monolithic root layout made deploying the frontend and backend as independent micro-services less modular.

### Correction & Resolution
1. **Repository Classification**: Restructured the workspace into clean, isolated `frontend/` and `backend/` directories with dedicated `package.json` configurations and root convenience scripts.
2. **Design Transformation**: Created a bespoke **Velvet Obsidian & Champagne Rose Gold** palette (`#08090C` canvas, `#161922` smoked glass cards, `#E5C392` champagne gold, Playfair Display typography, and Web Audio API synthesized chimes).
3. **Pure English Localization**: Streamlined all interface text to be 100% in refined English, eliminating mixed language toggling artifacts.
4. **Centralized Deterministic Queue Engine**: Unified all queue transitions (`Waiting → Called → In Chair → Done`, `Cancelled`, `No-show`) inside `frontend/src/core/queueEngine.ts` and `queueStore.tsx` utilizing the modern browser `BroadcastChannel` API, achieving instant (< 50ms) cross-window synchronization across all screens.
