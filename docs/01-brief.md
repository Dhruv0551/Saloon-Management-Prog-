# Project Brief — Salon Queue Management System

## 1. Problem Statement
Traditional walk-in salons suffer from unpredictable wait times, crowded waiting areas, and chaotic queue tracking, causing customer frustration and receptionist overload. This digital salon queue management system provides real-time queue visibility, remote check-in, barber preference matching, and synchronized live tracking across customer phones, staff devices, and a waiting-area TV display.

## 2. Target Users & Roles
- **Customers**: Walk-in and remote patrons who join the queue, select services and preferred barbers, track their live position, and receive notifications when to arrive and when their turn is called.
- **Receptionist**: Front-desk staff managing customer check-ins, adding walk-ins, monitoring waiting times, handling cancellations and no-shows, and calling next customers for barbers.
- **Barbers (Ravi, Amit, Imran)**: Salon service professionals using a simple mobile view to start/finish services, track active elapsed time, view upcoming assigned customers, and toggle availability or break status.
- **Owner / Administrator**: Salon manager configuring operational settings, toggling queue availability, managing services (pricing, duration, active status), setting barber shifts, and tracking daily performance metrics.

## 3. Must-Have Features (Core Scope)
1. **Bilingual Support (English & Gujarati)**: Full UI localization with an instant language toggle driven by centralized dictionary files.
2. **Remote & Walk-in Queue Registration**: Quick registration with 10-digit phone validation, max 3 service selections, and barber preference (Any Barber vs. Specific Barber).
3. **Live Status Tracking (`/status/:id`)**: Real-time position tracking, dynamic estimated wait time, "Start coming to salon" notice at position #2, and full-screen "It's your turn!" notification.
4. **Receptionist Tablet Dashboard (`/reception`)**: Landscape-optimized operational hub with barber chair cards, waiting list, quick walk-in modal, 60+ min wait highlight, and one-click actions (Call Next, No-show, Cancel).
5. **Barber Mobile Station (`/barber/:name`)**: One-handed mobile interface with large touch targets, live service stopwatch timer, customer details, and Start / Done / Break toggle actions.
6. **Waiting-Area TV Display (`/display`)**: High-contrast, large-typography wall display showing currently served tokens per barber, upcoming 5 queue tokens, estimated wait times, and golden flashing chimes for newly called tokens.
7. **Owner Management & Daily Metrics (`/admin`)**: Queue Open/Closed switch, auto-cutoff 30 minutes before closing, service CRUD (prices, durations, bilingual names), barber availability toggles, and daily analytics (served count, average wait time, no-shows).
8. **Centralized Queue Logic & Real-Time Sync**: Synchronized state across all screens within 5 seconds using strict non-reversible lifecycle states (`Waiting → Called → In Chair → Done`, `Waiting → Cancelled`, `Called → No-show`).

## 4. Features Explicitly Excluded (Out of Scope)
- No online or digital payments (cash/POS handled offline).
- No future-date or calendar appointment bookings (same-day live queue only).
- No SMS gateway or WhatsApp API integration (in-app notifications and TV/live status page only).
- No customer loyalty programs, rewards, or discounts.
- No multi-branch or franchise management (single salon location).
- No complex business reporting, payroll, or advanced business intelligence.

## 5. Visual Design Direction
A luxurious, dark charcoal and gold aesthetic inspired by premium modern salons (`#1F2937` charcoal surfaces, `#111827` dark background, `#D4A017` warm gold accents, and `#FFFFFF`/`#9CA3AF` crisp typography) with clean card layouts, generous touch targets (≥44px), and fluid responsive interactions across mobile, tablet, and TV displays.
