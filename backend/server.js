require('dotenv').config();
const express = require('express');
const cors = require('cors');

const githubRouter = require('./routes/github');
const contactRouter = require('./routes/contact');
const dataRouter = require('./routes/data');
const mcpRouter = require('./routes/mcp');

const app = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',   // Vite dev server
    'http://localhost:4173',   // Vite preview
    process.env.FRONTEND_URL  // Production URL (set in .env)
  ].filter(Boolean),
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

// ── Accept: text/markdown Content Negotiation Middleware ──────────────────────
app.use((req, res, next) => {
  const acceptHeader = req.headers.accept || '';
  if (acceptHeader.includes('text/markdown') || acceptHeader.includes('text/x-markdown')) {
    res.setHeader('Vary', 'Accept, Accept-Encoding');
    if (req.path === '/' || req.path === '/index.html') {
      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      return res.send(`# Shubham Panwar — AI & Systems Engineering Portfolio\n\nComputer Science Engineer specializing in low-level GPU acceleration, custom CUDA attention kernels, and scalable full-stack web architectures.\n\n## Quick Navigation\n- [/llms.txt](/llms.txt)\n- [/sitemap.xml](/sitemap.xml)\n- [/about.md](/about.md)\n- [/contact.md](/contact.md)\n- [/openapi.json](/openapi.json)\n- [/.well-known/mcp.json](/.well-known/mcp.json)\n`);
    }
  }
  next();
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/github', githubRouter);
app.use('/api/contact', contactRouter);
app.use('/api/mcp', mcpRouter);
app.use('/.well-known/mcp', mcpRouter);
app.use('/api', dataRouter);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/ping', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

// ── Agent-Friendly 404 Fallback ──────────────────────────────────────────────
app.use((req, res) => {
  const acceptHeader = req.headers.accept || '';
  res.setHeader('Vary', 'Accept, Accept-Encoding');
  
  if (acceptHeader.includes('text/markdown') || acceptHeader.includes('text/x-markdown') || req.path.endsWith('.md')) {
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    return res.status(404).send(`# 404 Not Found\n\nThe requested route \`${req.path}\` does not exist.\n\n## Helpful Resources for AI Agents\n- [llms.txt](/llms.txt)\n- [sitemap.xml](/sitemap.xml)\n- [openapi.json](/openapi.json)\n- [.well-known/mcp.json](/.well-known/mcp.json)\n`);
  }
  
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    message: 'Resource not found. Check /llms.txt or /sitemap.xml for available routes.'
  });
});

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  Portfolio API running at http://localhost:${PORT}`);
});
