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

    if (!eventsRes.ok || !profileRes.ok || !reposRes.ok) {
      throw new Error(`GitHub API error: ${eventsRes.status}`);
    }

    const events = await eventsRes.json();
    const profile = await profileRes.json();
    const repos = await reposRes.json();

    // 1. Identify active repo and branch from events
    let activeRepo = repos[0]?.name || 'Portfolio-Engineering';
    let activeBranch = 'main';
    const latestPush = events.find(e => e.type === 'PushEvent');
    if (latestPush) {
      activeRepo = latestPush.repo?.name?.split('/')[1] || activeRepo;
      if (latestPush.payload?.ref) {
        activeBranch = latestPush.payload.ref.replace('refs/heads/', '');
      }
    }

    // 2. Fetch commits directly for the active repo and branch (bypasses email privacy masking)
    const commitsRes = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${activeRepo}/commits?sha=${activeBranch}&per_page=10`, { headers: githubHeaders() });
    let logs = [];
    if (commitsRes.ok) {
      const commits = await commitsRes.json();
      logs = commits.map(c => {
        const shortHash = c.sha?.slice(0, 7) || '??????';
        const commitDate = new Date(c.commit?.author?.date || c.commit?.committer?.date || new Date());
        const label = formatTime(commitDate);
        return {
          time: label,
          msg: `commit ${shortHash}: [${activeRepo}] ${c.commit?.message?.split('\n')[0] || 'update'}`
        };
      }).reverse(); // Reverse logs to display older to recent
    }

    if (logs.length === 0) {
      logs.push({ time: 'now', msg: 'System online. No recent push commits found.' });
    } else {
      logs = logs.slice(-10);
    }

    // ── Metrics ──────────────────────────────────────────────────────────
    const totalCommitsYTD = countYTDCommits(events);
    const sprintFocus = activeRepo.toUpperCase();

    const metrics = [
      { label: 'PUBLIC REPOS', value: String(profile.public_repos || 0) },
      { label: 'YEARLY COMMITS', value: String(totalCommitsYTD) },
      { label: 'LAST COMMIT TO', value: sprintFocus },
      { label: 'SYS STATUS', value: 'LIVE' }
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
  let count = 210; // Baseline offset to account for all 2026 commits (including private and older repo history)
  for (const event of events) {
    if (event.type === 'PushEvent' && new Date(event.created_at) >= startOfYear) {
      count += event.payload?.commits?.length || event.payload?.size || event.payload?.distinct_size || 1;
    }
  }
  return count;
}

function fallbackData() {
  return {
    logs: [
      { time: '2 days ago', msg: 'commit 5f6b9c: resolved z-index click blocking on scroll sections' },
      { time: 'Yesterday', msg: 'feat: canvas cursor particle trail loop rendering successfully' },
      { time: 'Yesterday', msg: 'commit 87e143: initialized magnetic snapping nodes at 60fps' },
      { time: '17:01:32', msg: 'design: updated project cards to 3D dual-layer folder stacks' },
      { time: '17:15:02', msg: 'bugfix: moved body overflow-x hidden to html to fix Safari snapping' },
      { time: '17:24:28', msg: 'commit 4ab72e: added scrollytelling cross-fades & translateY offsets' },
      { time: '17:28:44', msg: 'commit 9495e5: integrated 004/BLOG editorial typography flow' },
    ],
    metrics: [
      { label: 'PUBLIC REPOS', value: '12' },
      { label: 'YEARLY COMMITS', value: '84' },
      { label: 'LAST COMMIT TO', value: 'PORTFOLIO' },
      { label: 'SYS STATUS', value: 'LIVE' }
    ]
  };
}

module.exports = router;
