const express = require('express');
const router = express.Router();
const projects = require('../data/projects.json');
const products = require('../data/products.json');

// ── GET /api/projects ─────────────────────────────────────────────────────
router.get('/projects', (_req, res) => {
  res.json(projects);
});

// ── GET /api/products ─────────────────────────────────────────────────────
router.get('/products', (_req, res) => {
  res.json(products);
});

// ── GET /api/ping (health check alias) ───────────────────────────────────
router.get('/ping', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

module.exports = router;
