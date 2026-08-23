const express = require('express');
const router = express.Router();

const TOOLS = [
  {
    name: 'get_portfolio_summary',
    description: 'Returns executive summary, bio, skills, and contact channels for Shubham Panwar.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'query_chatbot',
    description: 'Query the portfolio AI assistant for answers regarding projects, CUDA, or background.',
    inputSchema: {
      type: 'object',
      properties: { message: { type: 'string', description: 'Question for Shubham\'s AI assistant' } },
      required: ['message']
    }
  },
  {
    name: 'get_projects',
    description: 'List open-source projects, attention kernel repos, and technical stack details.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_github_activity',
    description: 'Fetch real-time GitHub commit history and active build status.',
    inputSchema: { type: 'object', properties: {} }
  }
];

// MCP Manifest handshake endpoint
router.get('/manifest', (_req, res) => {
  res.json({
    name: 'shubham-panwar-portfolio-mcp',
    version: '1.0.0',
    transport: 'streamable-http',
    tools: TOOLS
  });
});

// MCP JSON-RPC / Streamable HTTP endpoint
router.post('/call', (req, res) => {
  const { tool, arguments: args } = req.body || {};

  if (tool === 'get_portfolio_summary') {
    return res.json({
      content: [
        {
          type: 'text',
          text: '# Shubham Panwar — Bio & Summary\nRole: AI & Systems Engineer\nLocation: Delhi, India\nEmail: shubhamworking1004@gmail.com\nGitHub: https://github.com/shubh-panwar\nLinkedIn: https://www.linkedin.com/in/shubham-panwar-9324b02a8/\nFocus: Custom CUDA attention kernels, ML systems architecture, and scalable web platforms.'
        }
      ]
    });
  }

  if (tool === 'get_projects') {
    return res.json({
      content: [
        {
          type: 'text',
          text: '1. Attention-Kernels (CUDA / Triton / Python) — Optimized memory bandwidth transformer attention kernels.\n2. Interactive Portfolio Platform (React 19 / Express) — Spatial graph & AI assistant.'
        }
      ]
    });
  }

  if (tool === 'query_chatbot') {
    const question = (args && args.message) ? args.message : 'Hello';
    return res.json({
      content: [
        {
          type: 'text',
          text: `Answer for "${question}": Shubham Panwar is an AI & Systems Engineer specializing in CUDA, PyTorch, and full-stack engineering.`
        }
      ]
    });
  }

  return res.status(404).json({ error: `Tool ${tool} not found` });
});

module.exports = router;
