const express = require('express');
const router = express.Router();
const projects = require('../data/projects.json');

// ── GET /api/projects ─────────────────────────────────────────────────────
router.get('/projects', (_req, res) => {
  res.json(projects);
});

// ── GET /api/ping (health check alias) ───────────────────────────────────
router.get('/ping', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

module.exports = router;
