require('dotenv').config();
const express = require('express');
const cors = require('cors');

const githubRouter = require('./routes/github');
const contactRouter = require('./routes/contact');
const dataRouter = require('./routes/data');

const app = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',   // Vite dev server
    'http://localhost:4173',   // Vite preview
    process.env.FRONTEND_URL  // Production URL (set in .env)
  ].filter(Boolean),
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/github', githubRouter);
app.use('/api/contact', contactRouter);
app.use('/api', dataRouter);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/ping', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

// ── 404 fallback ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  Portfolio API running at http://localhost:${PORT}`);
});
