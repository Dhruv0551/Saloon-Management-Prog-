// Salon Queue Management Real-Time Sync Server
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory queue state (synced with frontend)
let salonState = {
  isOpen: true,
  openTime: '09:00',
  closeTime: '20:00',
  barbers: [
    { id: 'ravi', name: 'Ravi', status: 'free', activeToday: true },
    { id: 'amit', name: 'Amit', status: 'busy', currentToken: 'S-12', activeToday: true },
    { id: 'imran', name: 'Imran', status: 'break', activeToday: true },
  ],
  queue: [],
  dailyStats: {
    totalServed: 0,
    avgWaitMinutes: 0,
    noShowCount: 0,
    cancelCount: 0,
  }
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/queue/state', (req, res) => {
  res.json(salonState);
});

app.post('/api/queue/state', (req, res) => {
  salonState = { ...salonState, ...req.body };
  res.json({ success: true, state: salonState });
});

app.listen(PORT, () => {
  console.log(`Salon Sync Server running on port ${PORT}`);
});
