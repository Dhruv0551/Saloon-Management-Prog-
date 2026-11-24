# Salon Queue Management — Backend Server

A lightweight Node.js/Express synchronization service for cross-device queue synchronization.

## Setup & Running
```bash
cd backend
npm install
npm run dev
```

The server exposes:
- `GET /api/health`: Health status
- `GET /api/queue/state`: Current synchronized queue state
- `POST /api/queue/state`: Updates centralized state
