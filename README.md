# Salon Queue Management System (Luxe Salon / લક્સ સલૂન)

**Live demo:** [Deployment Pending — To be deployed in Step 9]

**Hosted on:** Vercel (Frontend) & Render/Railway (Real-time Sync)

**Staff Access PIN (Default Test Credentials):**
- Reception Dashboard (`/reception`): Access PIN `1234` (or direct access)
- Barber View (`/barber/ravi`, `/barber/amit`, `/barber/imran`)
- Admin Settings (`/admin`): Admin PIN `9999` (or direct access)

---

## Project Overview
A digital salon queue management platform that enables customers to join remotely, select services and preferred barbers, track live queue positions, and receive alerts when called. Salon staff manage chairs and walk-ins via an interactive tablet dashboard, barbers control service timers on mobile, and guests monitor live progress on a waiting-area TV display.

## Key Features
- **Bilingual Interface**: Seamless switching between English and Gujarati across all screens.
- **7 Dedicated Screens**:
  1. Customer Landing (`/`)
  2. Remote Queue Registration (`/join`)
  3. Live Position Tracking (`/status/:id`)
  4. Receptionist Tablet Dashboard (`/reception`)
  5. Barber Mobile Station (`/barber/:name`)
  6. Waiting Area Wall Display (`/display`)
  7. Owner Operations & Catalog (`/admin`)
- **Strict FIFO & Barber Preferences**: Customers can choose "Any Barber (Fastest)" or a specific barber (Ravi, Amit, Imran).
- **Dynamic Estimated Waiting Times**: Recalculated dynamically based on real backlog and active barbers.
- **Flashing TV Alerts & Chimes**: Ambient display with Web Audio chime and gold flashing highlights when tokens are called.
- **Automated Rules**: 30-minute pre-closing cutoff for remote signups, 10-minute no-show thresholds, duplicate phone prevention.

## Documentation
- [`docs/01-brief.md`](docs/01-brief.md) — Project Brief & Requirements
- [`docs/02-screens.md`](docs/02-screens.md) — Comprehensive Screen Specifications
- [`docs/03-flows-rules.md`](docs/03-flows-rules.md) — Queue Rules, State Transitions, and Test Cases
- [`AGENTS.md`](AGENTS.md) — Guidelines & Development Instructions
- [`prompts.md`](prompts.md) — Chronological Prompt Log
