# Application Screens Specification — Salon Queue Management System

This document specifies the user interface, interactions, layouts, and states for all seven screens in the system. All screens adhere to the premium dark charcoal (`#1F2937`), dark background (`#111827`), and elegant gold (`#D4A017`) design system with full bilingual English/Gujarati support.

---

## Screen 1: Home — `/`

### 1. Overview
- **URL**: `/`
- **Users**: Prospective and arriving salon customers.
- **Purpose**: Provides quick visibility into salon operating hours, current queue density, estimated wait times, and real-time barber availability before joining the queue.

### 2. UI Elements (Top-to-Bottom Order)
1. **Header / Navigation Bar**:
   - Salon Brand Logo & Name ("Luxe Salon / લક્સ સલૂન").
   - Language Selector toggle (English / ગુજરાતી).
   - Staff Portal Quick-Links icon/menu (links to `/reception`, `/admin`, `/display`).
2. **Salon Status Banner**:
   - Operational Badge: Green "Open Now" or Red "Closed / Queue Full".
   - Hours of Operation indicator ("Today: 9:00 AM – 8:00 PM").
   - Online Queue cutoff notice (e.g., "Online registration closes at 7:30 PM").
3. **Queue Overview Metric Cards (2-column or 3-column)**:
   - **People Waiting**: Live count of active waiting customers.
   - **Approximate Wait Time**: Estimated minutes based on services ahead and active barbers.
   - **Active Barbers**: Number of barbers currently on duty (e.g., "3 of 3 Available").
4. **Barber Availability Cards Grid**:
   - Card for each barber (Ravi, Amit, Imran):
     - Avatar / Photo and Name.
     - Live Status Badge:
       - **Free (Green)**: Ready for next customer.
       - **Busy (Gold)**: Currently serving a customer with elapsed timer.
       - **On Break (Muted Grey)**: Temporarily unavailable.
     - Current serving token (if busy).
5. **Call-to-Action Section**:
   - Prominent, high-contrast Gold button: **"Join Queue" / "કતારમાં જોડાઓ"** (navigates to `/join`).
   - Secondary button: **"Check My Status" / "મારી સ્થિતિ જુઓ"** (modal or input prompt for existing token / phone number lookup).
6. **Footer**:
   - Salon address, contact phone number, and opening hours summary.

### 3. Interactions & Button Behaviors
- **Language Toggle**: Switches all text instantly between English and Gujarati without page reload.
- **"Join Queue" Button**:
  - If queue is open: Navigates to `/join`.
  - If queue is closed (or within 30 mins of closing): Button is disabled with explanatory tooltip/banner ("Online queue is closed. Walk-ins accepted at reception.").
- **Barber Card Click**: Opens an info drawer/tooltip showing barber specialties and current queue load.

### 4. Layouts
- **Mobile (< 768px)**: Single-column vertical stack; sticky bottom CTA button for "Join Queue"; metric cards in 2x1 grid.
- **Tablet / Desktop (≥ 768px)**: Centered hero container (max-w-4xl); metric cards in 3-column row; barber cards in 3-column grid.

### 5. Edge States
- **Empty State**: When 0 customers are waiting, displays: "No wait right now! Walk in or join to get served immediately."
- **Loading State**: Shimmer skeleton cards for metrics and barber cards during initial data fetch.
- **Error State**: Banner: "Unable to load salon live status. Retrying..." with a manual "Refresh" button.

---

## Screen 2: Join Queue — `/join`

### 1. Overview
- **URL**: `/join`
- **Users**: Remote customers or walk-in patrons using their own smartphones.
- **Purpose**: Collect customer contact info, validate phone number, select up to 3 services, choose a barber preference, display price/duration breakdown, and generate a queue token.

### 2. UI Elements (Top-to-Bottom Order)
1. **Header**:
   - Back button (`< Back to Home`).
   - Title: "Join the Salon Queue" / "સલૂન કતારમાં જોડાઓ".
   - Subtitle: "Quick, hassle-free digital check-in".
   - Language selector.
2. **Customer Information Form**:
   - **Full Name**: Text input field with clear placeholder.
   - **Phone Number**: 10-digit numeric input with Indian phone prefix (+91) indicator and inline validation icon.
3. **Service Selection Section**:
   - Section heading with counter: "Select Services (Max 3)" / "સેવાઓ પસંદ કરો (મહત્તમ ૩)".
   - Service Cards Grid (Haircut, Beard Trim, Hair Spa, Hair Wash, Facial, etc.):
     - Service Name (Bilingual).
     - Estimated Duration (e.g., "30 mins").
     - Price in INR (e.g., "₹250").
     - Checkbox / Selected highlight with gold border and checkmark icon.
     - Disabled/Grayed state when 3 services are already selected.
4. **Barber Preference Section**:
   - Radio cards / buttons:
     - **Any Barber (Fastest)** (Recommended default option).
     - **Ravi** (Current status badge: Free / Busy / On Break).
     - **Amit** (Current status badge: Free / Busy / On Break).
     - **Imran** (Current status badge: Free / Busy / On Break).
   - Warning banner if selected barber is currently "On Break" ("This barber is on break. Your wait time may be longer.").
5. **Live Queue Summary Card (Sticky or Dynamic Bottom Container)**:
   - Selected Services list tags.
   - Total Estimated Service Duration: $\sum \text{duration}$ in minutes.
   - Total Estimated Price: $\sum \text{price}$ in ₹.
   - Estimated Initial Wait Time: Calculated based on queue backlog.
6. **Confirmation CTA Button**:
   - Large Gold Button: **"Confirm & Get Token" / "ખાતરી કરો અને ટોકન મેળવો"** (min height 48px).

### 3. Interactions & Button Behaviors
- **Phone Validation**: Restricts input to 10 digits; rejects non-numeric characters; validates against active queue entries to prevent duplicates.
- **Service Selection**: Clicking toggles service selection. When 3 items are selected, unselected cards show a tooltip: "Maximum 3 services allowed".
- **Dynamic Price & Duration**: Recalculates totals instantly on every toggle.
- **Submit Action**:
  - Validates name length (≥ 2 chars) and phone number (exactly 10 digits).
  - Checks if phone is already active in queue; if yes, shows error message with link to `/status/:existingId`.
  - Dispatches queue registration payload, generates token (e.g., `S-14`), saves token ID to client session/localStorage, and redirects to `/status/:id`.

### 4. Layouts
- **Mobile (< 768px)**: 1-column layout; sticky bottom summary drawer with "Confirm" button.
- **Tablet / Desktop (≥ 768px)**: 2-column layout — left column contains inputs and service grid; right column contains sticky summary card and barber selection.

### 5. Edge States
- **Queue Closed**: If online queue is closed (admin toggle or 30 min cutoff), replaces form with notice: "Online check-in is currently closed. Please visit reception for walk-in availability."
- **Loading State**: Submit button displays spinning loader: "Registering spot..." with form inputs locked.
- **Error State**: Inline red alerts below invalid inputs (e.g., "Please enter a valid 10-digit mobile number").

---

## Screen 3: My Status — `/status/:id`

### 1. Overview
- **URL**: `/status/:id` (where `:id` is the unique customer queue entry identifier).
- **Users**: Customers tracking their active spot in line from their smartphone.
- **Purpose**: Live visibility into position, dynamic wait time, barber assignment, real-time stage alerts ("Start coming" / "It's your turn!"), and self-cancellation option.

### 2. UI Elements (Top-to-Bottom Order)
1. **Header Bar**:
   - Salon Name & Logo.
   - Language selector.
   - Live Connection Status pill (Green pulsing dot: "Live Updates Active").
2. **Token Display Card (Hero element)**:
   - Giant Token Identifier (e.g., `S-14`) rendered in gold typography.
   - Customer Name & registered phone (masked, e.g., `+91 98****1234`).
   - Current Status Badge: `Waiting` / `Called` / `In Chair` / `Done` / `Cancelled` / `No-show`.
3. **Queue Position & Wait Time Highlights**:
   - **Queue Position**: "You are #X in line" (e.g., "#2 in line").
   - **Estimated Wait Time**: Dynamic countdown (e.g., "~15 mins").
   - **Assigned Barber**: "Ravi" or "Assigned at Call (Any Barber)".
4. **Service Breakdown Accordion/Card**:
   - List of booked services with individual prices and durations.
   - Total amount payable at salon counter.
5. **Stage Notification Banners (Dynamic)**:
   - **Normal Waiting (Position > 2)**: "Relax! We'll alert you when your turn approaches."
   - **Stage 1 Alert (Position = 2)**: Amber banner: **"Start heading to the salon! You're next in line." / "કૃપા કરીને સલૂન આવવાનું શરૂ કરો! તમારો વારો ટૂંક સમયમાં છે."**
   - **Stage 2 Alert (`status === 'Called'`)**: Full-screen modal / takeover banner: **"It's Your Turn! Please proceed to Chair [Barber Name]." / "તમારો વારો આવી ગયો છે! કૃપા કરીને આગળ વધો."** with audio chime/vibration.
   - **In Chair (`status === 'In Chair'`)**: "Service in progress with [Barber Name]. Enjoy your grooming!"
   - **Completed (`status === 'Done'`)**: "Thank you for visiting Luxe Salon! See you soon."
6. **Actions**:
   - **"Cancel My Spot" / "મારું સ્થાન રદ કરો"** button (subtle red outline button).
   - Confirmation Dialog before cancellation: "Are you sure? You will lose your position in line."

### 3. Interactions & Button Behaviors
- **Auto-Sync / Polling**: Subscribes to real-time events or polls every 3–5 seconds. UI smoothly animates when position moves up.
- **Cancel Button**: Opens modal with "Keep My Spot" and "Confirm Cancellation". If confirmed, transitions status to `Cancelled` and displays cancellation receipt screen with button to return to home.
- **Audio Chime**: Triggers gentle audio alert when status transitions from `Waiting` to `Called`.

### 4. Layouts
- **Mobile (< 768px)**: Clean single-column mobile-card layout, high contrast token card visible without scrolling.
- **Desktop (≥ 768px)**: Centered card container (max-w-md) resembling mobile view for consistent customer experience.

### 5. Edge States
- **Token Not Found**: Message: "Queue token not found or expired" with button to return to `/`.
- **Cancelled / No-show State**: Display card: "This token was marked as cancelled/no-show. You may join the queue again." with CTA "Join Queue Again".
- **Done State**: Congratulatory receipt card with service summary and link to book again.

---

## Screen 4: Reception Dashboard — `/reception`

### 1. Overview
- **URL**: `/reception`
- **Users**: Salon receptionist / Front desk manager on a tablet (landscape orientation).
- **Purpose**: Operational control room to oversee all active barber chairs, manage walk-in arrivals, call next customers, flag no-shows, and maintain customer flow.

### 2. UI Elements (Top-to-Bottom Order)
1. **Top Control Bar**:
   - Reception Header with Live Clock (HH:MM:SS) and date.
   - Language selector.
   - Quick Summary Pills: Total Waiting, Total In Chair, Completed Today.
   - **"+ Add Walk-in" / "+ વોક-ઇન ઉમેરો"** prominent gold button.
   - Queue Open/Closed toggle quick status.
2. **Barber Chairs Section (Horizontal Row of 3 Cards)**:
   - One card for each barber (Ravi, Amit, Imran):
     - Barber Avatar, Name, and current Availability Status.
     - Current Customer card (Token, Name, Services, Elapsed time since service start).
     - **"Call Next" Button**: Calls the earliest eligible customer for this barber.
     - **"Mark Done" Button**: Completes current service.
     - Chair empty state when barber is free.
3. **Waiting Queue Table / Cards**:
   - Columns:
     - **Token**: Large text (e.g., `S-12`).
     - **Customer Name & Phone**.
     - **Type**: Badge for `Remote` (Online) vs. `Walk-in`.
     - **Services**: Service chips with total duration.
     - **Preferred Barber**: Specific barber badge or "Any Barber".
     - **Wait Time Elapsed**: Live counter showing minutes waiting since check-in.
       - **Visual Alert**: Rows with wait time > 60 minutes are highlighted with an amber/red border and warning icon.
     - **Status Badge**: `Waiting` (Blue/Gold) or `Called` (Flashing Green).
     - **Actions**:
       - `Call Next` (if matching chair is free).
       - `Mark No-show` (active for customers called > 10 mins ago).
       - `Cancel` (with confirmation).
4. **Walk-in Modal (Overlay)**:
   - Quick input form: Name, 10-digit Phone, Service multiselect (max 3), Barber preference.
   - Fast submit button "Add to Queue" (auto-assigns next sequential token).

### 3. Interactions & Button Behaviors
- **Call Next Button**:
  - Automatically identifies the earliest eligible waiting customer (FIFO order matching the barber or Any Barber).
  - Updates customer status to `Called`.
  - Notifies customer phone and updates TV display with flashing animation.
- **Mark No-show Button**:
  - Available on `Called` customers. Prompt: "Mark customer as No-show? They will be removed from the active queue."
  - Sets customer status to `No-show`. Free up the chair or queue slot.
- **Cancel Button**:
  - Removes customer from queue with reason prompt ("Customer left", "Mistake").
- **Add Walk-in Modal**:
  - Populates in < 15 seconds for rapid front-desk entry. Supports keyboard shortcuts (Enter to submit).

### 4. Layouts
- **Tablet Landscape / Desktop (Primary Layout, 1024px+)**: Split view with Barber Chair Cards across the top and the full interactive queue list below.
- **Mobile (< 768px)**: Compact stacked view with toggle tabs ("Chairs", "Queue", "Walk-in").

### 5. Edge States
- **Empty Queue**: "Queue is clear! No customers waiting." with "+ Add Walk-in" button.
- **All Barbers Busy**: "Call Next" disabled with tooltip: "All barber chairs currently occupied."
- **Disconnected / Offline**: Red header alert: "Connection lost. Reconnecting to live queue..."

---

## Screen 5: Barber View — `/barber/:name`

### 1. Overview
- **URL**: `/barber/:name` (e.g., `/barber/ravi`, `/barber/amit`, `/barber/imran`).
- **Users**: Barbers using their own smartphones at their station.
- **Purpose**: Ultra-clean, distraction-free interface with massive buttons (≥ 50px) to inspect current client details, run the service stopwatch, complete services, and manage break status.

### 2. UI Elements (Top-to-Bottom Order)
1. **Header**:
   - Barber Name ("Ravi's Chair" / "રવિ ની ચેર").
   - Status Toggle: **Available (Green)** vs. **On Break (Grey/Amber)**.
   - Language selector.
2. **Current Customer Focus Card**:
   - If serving a customer:
     - Token (`S-14`) in massive gold display.
     - Customer Name.
     - Selected Services list with breakdown.
     - Live Service Stopwatch (Minutes:Seconds elapsed since service started).
     - Service Target Duration (e.g., "Elapsed: 18:24 / Est: 35 mins").
   - If chair is empty:
     - "Chair is currently free."
     - Prompt: "Ready for your next customer?"
3. **Primary Action Buttons (Massive Touch Targets)**:
   - If empty & eligible customer waiting:
     - **"Call Next Customer" / "આગળના ગ્રાહકને બોલાવો"** (Full-width Green button).
   - If customer is `Called` and sits in chair:
     - **"Start Service" / "સેવા શરૂ કરો"** (Changes status to `In Chair`, starts stopwatch).
   - If customer is `In Chair`:
     - **"Done / Complete" / "પૂર્ણ થયું"** (Full-width Gold button; finishes service, marks `Done`, sets chair free).
4. **Upcoming Customer Preview**:
   - Next assigned customer card (Token, Name, Services, Estimated wait).
   - Lets barber mentally prepare tools for the next haircut/treatment.
5. **Break Mode Banner**:
   - When "On Break" is active: Card states "You are currently on break. You will not be assigned new customers." with a single "Resume Work" button.

### 3. Interactions & Button Behaviors
- **Available / On Break Switch**: Instant toggle. Emits availability status change across reception and home screens.
- **Start Service**: Transition from `Called` to `In Chair`. Starts active timer.
- **Done Button**: Prompts quick confirmation ("Complete service for S-14?"). On confirm, sets customer to `Done`, logs service time, and clears chair.

### 4. Layouts
- **Mobile (Default)**: Single-column vertical layout with bottom-anchored action button for one-handed operation.
- **Desktop/Tablet**: Centered card layout optimized for stationary phone stands on barber mirrors.

### 5. Edge States
- **Invalid Barber Name**: Shows error: "Barber not recognized. Choose: Ravi, Amit, or Imran." with links to each.
- **No Customers Waiting**: "No customers waiting right now. Enjoy your break!"

---

## Screen 6: Waiting Area TV — `/display`

### 1. Overview
- **URL**: `/display`
- **Users**: Waiting customers and salon guests viewing a large wall-mounted TV from 3–7 meters away.
- **Purpose**: Ambient, high-contrast, large-format queue display showing who is currently in chair for each barber and the next 5 upcoming tokens, accompanied by chime and visual flash when a token is called.

### 2. UI Elements (Top-to-Bottom Order)
1. **Top Header Bar**:
   - Luxe Salon Brand Logo & Name in high-contrast gold.
   - Current Real-time Clock (e.g., "04:30 PM") and Date.
   - Bilingual rolling ticker / subtitle ("Welcome to Luxe Salon • લક્સ સલૂનમાં આપનું સ્વાગત છે").
2. **Barber Serving Grid (Main Viewport, Left 60% or Top Row)**:
   - 3 Large Barber Station Cards (Ravi, Amit, Imran):
     - Barber Photo/Avatar and Name.
     - Station Number (Chair 1, Chair 2, Chair 3).
     - **Now Serving Token**: Huge 72pt+ typography (e.g., `S-14`).
     - Customer First Name.
     - Service in progress.
     - Status Indicator: "Serving" (Green/Gold) or "Available" or "On Break".
     - **New Call Animation**: If a token was called within the last 15 seconds, the card pulses with a vibrant gold border and glowing badge.
3. **Upcoming Queue Section (Right 40% or Bottom Row)**:
   - Heading: "Next in Line / આગળનો વારો" (Upcoming 5 Tokens).
   - 5 Horizontal Token Cards:
     - Token Number (e.g., `S-15`, `S-16`, `S-17`, `S-18`, `S-19`).
     - Preferred Barber (or "Any").
     - Estimated Wait Time (e.g., "~10 min", "~25 min").
     - Subtle badge for position #1, #2, etc.
4. **Bottom Information Ticker**:
   - Salon WiFi credentials ("Guest WiFi: LuxeSalon | Pass: welcome123").
   - Polite notice: "Please approach your barber when your token is called."

### 3. Interactions & Visual / Audio Behaviors
- **Fullscreen Mode**: Hidden toggle or `F11` support; full-screen icon in corner for receptionist setup.
- **Flashing Effect**: When a customer's status transitions to `Called`, their token on the TV flashes gold for 10 seconds.
- **Audio Chime**: Web Audio API generates a subtle, pleasant 2-tone chime whenever any customer is called. (Includes a user gesture start overlay for TV browser audio permission).
- **Auto-Refresh / Zero-Interaction**: Completely hands-free; automatically recovers from network dropouts.

### 4. Layouts
- **TV / 1080p / 4K Landscape (Default)**: 2-column or grid layout with 1.5x to 2x scaled typography designed for legibility at 5+ meters.
- **Portrait TV Option**: Responsive flex-col layout if salon mounts TV vertically.

### 5. Edge States
- **All Chairs Free & Queue Empty**: Elegant ambient screen: "Welcome! Chairs are currently open. Please check in with reception or scan QR code to join."
- **Offline / Stale Data**: Subtle warning dot in footer ("Reconnecting to queue...").

---

## Screen 7: Owner Settings — `/admin`

### 1. Overview
- **URL**: `/admin`
- **Users**: Salon Owner and Senior Managers.
- **Purpose**: Manage salon master data (services, pricing, durations, active toggles), staff shifts, queue operational controls, and inspect daily performance metrics.

### 2. UI Elements (Top-to-Bottom Order)
1. **Admin Header**:
   - Dashboard Title: "Salon Management & Settings" / "સલૂન વ્યવસ્થાપન અને સેટિંગ્સ".
   - Language selector.
   - Quick Navigation Tabs:
     - Tab 1: **Queue Controls & Shifts**
     - Tab 2: **Service Catalog**
     - Tab 3: **Today's Analytics**
2. **Tab 1: Queue Controls & Barber Shifts**:
   - **Queue Operational Switch**:
     - "Queue Status: OPEN / CLOSED" (Large toggle switch).
     - Explanation: "When closed, customers cannot join online or via mobile."
   - **Operating Hours Configuration**:
     - Salon Open Time (e.g., 09:00 AM) and Salon Close Time (e.g., 08:00 PM).
     - Auto-Cutoff Rule indicator ("Online queue automatically closes 30 mins before closing time").
   - **Barbers Working Today**:
     - List of 3 Barbers (Ravi, Amit, Imran).
     - Toggle: "Working Today (Active)" vs. "Off Duty".
     - Real-time Status Override (Available / On Break).
3. **Tab 2: Service Catalog Management**:
   - **Service List Table**:
     - Columns: Service Name (English), Service Name (Gujarati), Duration (mins), Price (₹), Status (Active/Inactive), Actions.
   - **Add / Edit Service Modal**:
     - English Name input (e.g., "Haircut").
     - Gujarati Name input (e.g., "વાળ કાપવા").
     - Duration input in minutes (e.g., 30).
     - Price input in INR (e.g., 250).
     - Active toggle: Turning off a service immediately removes it from the customer Join Queue screen.
4. **Tab 3: Today's Statistics & KPI Cards**:
   - **Customers Served**: Total count of completed (`Done`) visits today.
   - **Average Wait Time**: Average minutes from registration to service start.
   - **Total No-shows**: Count of missed appointments.
   - **Total Cancellations**: Count of self-cancelled or staff-cancelled spots.
   - **Barber Breakdown Table**: Customers served and busy hours per barber today.

### 3. Interactions & Button Behaviors
- **Queue Open/Close Toggle**: Instantly modifies global salon state. When switched off, `/join` immediately displays closed notice.
- **Service Active Toggle**: Instantly toggles visibility of services in `/join` and `/reception`.
- **Add / Edit Service**: Validates fields (positive integers for price and duration); updates centralized store.
- **Reset Daily Queue Data**: Admin utility button to start a fresh day (clears daily tokens, resets metrics).

### 4. Layouts
- **Desktop / Tablet (Recommended)**: Multi-tab layout with summary cards and clean data tables.
- **Mobile (< 768px)**: Stacked responsive cards with horizontal tab scrolling.

### 5. Edge States
- **No Services Configured**: "No services currently active. Add services to enable queue registration."
- **Zero Customers Today**: Analytics display: "No completed customers recorded yet today."
