const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'shubh-panwar';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Build auth headers (token optional — raises rate limit from 60 to 5000 req/hr)
function githubHeaders() {
  const headers = { 'Accept': 'application/vnd.github+json' };
  if (GITHUB_TOKEN) headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  return headers;
}

// ── GET /api/github/activity ──────────────────────────────────────────────
// Returns recent push events (commits) + profile stats for Build In Public
router.get('/activity', async (req, res) => {
  try {
    const [eventsRes, profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=50`, { headers: githubHeaders() }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers: githubHeaders() }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`, { headers: githubHeaders() })
    ]);

    if (!eventsRes.ok || !profileRes.ok) {
      throw new Error(`GitHub API error: ${eventsRes.status}`);
    }

    const events = await eventsRes.json();
    const profile = await profileRes.json();
    const repos = await reposRes.json();

    // ── Flatten all commits from PushEvents ──────────────────────────────
    const logs = [];
    for (const event of events) {
      if (event.type === 'PushEvent' && event.payload?.commits) {
        for (const commit of event.payload.commits) {
          const shortHash = commit.sha?.slice(0, 7) || '??????';
          const repoName = event.repo?.name?.split('/')[1] || 'unknown';
          const pushedAt = new Date(event.created_at);
          const label = formatTime(pushedAt);

          logs.push({
            time: label,
            msg: `commit ${shortHash}: [${repoName}] ${commit.message?.split('\n')[0] || 'update'}`
          });
          if (logs.length >= 10) break;
        }
      }
      if (logs.length >= 10) break;
    }

    // ── Metrics ──────────────────────────────────────────────────────────
    const totalCommitsYTD = countYTDCommits(events);
    const sprintFocus = repos[0]?.name?.toUpperCase() || 'PORTFOLIO';

    const metrics = [
      { label: 'PUBLIC REPOS', value: String(profile.public_repos || 0) },
      { label: 'YEARLY COMMITS', value: String(totalCommitsYTD) },
      { label: 'SPRINT FOCUS', value: sprintFocus },
      { label: 'SYS STATUS', value: 'OPERATIONAL' }
    ];

    res.json({ logs, metrics });
  } catch (err) {
    console.error('[GitHub API]', err.message);
    // Graceful fallback — returns static data so UI never breaks
    res.json(fallbackData());
  }
});

// ── Helpers ───────────────────────────────────────────────────────────────
function formatTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 6) return `${diffDays} days ago`;
  return 'Last week';
}

function countYTDCommits(events) {
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  let count = 0;
  for (const event of events) {
    if (event.type === 'PushEvent' && new Date(event.created_at) >= startOfYear) {
      count += event.payload?.commits?.length || 0;
    }
  }
  return count;
}

function fallbackData() {
  return {
    logs: [
      { time: '17:28:44', msg: 'commit 9495e5: integrated 004/BLOG editorial typography flow' },
      { time: '17:24:28', msg: 'commit 4ab72e: added scrollytelling cross-fades & translateY offsets' },
      { time: '17:15:02', msg: 'bugfix: moved body overflow-x hidden to html to fix Safari snapping' },
      { time: '17:01:32', msg: 'design: updated project cards to 3D dual-layer folder stacks' },
      { time: 'Yesterday', msg: 'commit 87e143: initialized magnetic snapping nodes at 60fps' },
      { time: 'Yesterday', msg: 'feat: canvas cursor particle trail loop rendering successfully' },
      { time: '2 days ago', msg: 'commit 5f6b9c: resolved z-index click blocking on scroll sections' },
    ],
    metrics: [
      { label: 'PUBLIC REPOS', value: '12' },
      { label: 'YEARLY COMMITS', value: '84' },
      { label: 'SPRINT FOCUS', value: 'PORTFOLIO' },
      { label: 'SYS STATUS', value: 'OPERATIONAL' }
    ]
  };
}

module.exports = router;
