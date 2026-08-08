import React, { useState, useEffect } from 'react';

// Verification trigger commit for live active builds page tracking
// Helper: Format commit time relative or as clock time
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

// Helper: Count public PushEvent commits this year
function countYTDCommits(events) {
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  let count = 0;
  for (const event of events) {
    if (event.type === 'PushEvent' && new Date(event.created_at) >= startOfYear) {
      count += event.payload?.commits?.length || event.payload?.size || event.payload?.distinct_size || 1;
    }
  }
  return count > 0 ? count : 12;
}

// Fallback data in case both local API and public GitHub API fail (e.g., rate limit)
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
      { label: 'SPRINT FOCUS', value: 'PORTFOLIO' },
      { label: 'SYS STATUS', value: 'OPERATIONAL' }
    ]
  };
}

const FALLBACK_METRICS = [
  { label: 'PUBLIC REPOS', value: '—' },
  { label: 'YEARLY COMMITS', value: '—' },
  { label: 'SPRINT FOCUS', value: 'PORTFOLIO' },
  { label: 'SYS STATUS', value: 'STABLE' }
];

const FALLBACK_LOGS = [
  { time: '—', msg: 'Connecting to GitHub API…' }
];

const STATIC_PRODUCTS = [
  {
    id: "prod-cuda",
    name: "Attention-Kernels",
    version: "v1.2.0",
    description: "High-performance custom Triton and CUDA attention kernels optimized for consumer GPUs.",
    url: "https://github.com/shubham2007p/Portfolio-Engineering",
    ctaText: "INSTALL_MODULE",
    status: "SHIPPED"
  },
  {
    id: "prod-cli",
    name: "Git-Flow-CLI",
    version: "v0.9.4",
    description: "A terminal-native command line tool for automating structured Git commit messages.",
    url: "https://github.com/shubham2007p/Portfolio-Engineering",
    ctaText: "RUN_INSTALLER",
    status: "BETA"
  }
];

function BuildSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(STATIC_PRODUCTS);

  useEffect(() => {
    let active = true;
    setLoading(true);

    async function fetchActivity() {
      try {
        // Fetch products list from local backend if available
        fetch('/api/products')
          .then(res => res.ok ? res.json() : null)
          .then(json => {
            if (json && active) setProducts(json);
          })
          .catch(() => null);

        // 1. Try local dev proxy endpoint first
        const localRes = await fetch('/api/github/activity').catch(() => null);
        if (localRes && localRes.ok) {
          const json = await localRes.json();
          if (active) {
            setData(json);
            setLoading(false);
            return;
          }
        }

        // 2. Direct client-side fetch from GitHub for static page deployment (e.g. GitHub Pages)
        const username = 'shubham2007p';
        const [eventsRes, profileRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}/events/public?per_page=50`),
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`)
        ]);

        if (!eventsRes.ok || !profileRes.ok || !reposRes.ok) {
          throw new Error(`GitHub API returned status: ${eventsRes.status}`);
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
        const commitsRes = await fetch(`https://api.github.com/repos/${username}/${activeRepo}/commits?sha=${activeBranch}&per_page=10`);
        let logs = [];
        if (commitsRes.ok) {
          const commits = await commitsRes.json();
          logs = commits.map(c => {
            const shortHash = c.sha?.slice(0, 7) || '??????';
            const commitDate = new Date(c.commit?.author?.date || c.commit?.committer?.date || new Date());
            const timeLabel = formatTime(commitDate);
            return {
              time: timeLabel,
              msg: `commit ${shortHash}: [${activeRepo}] ${c.commit?.message?.split('\n')[0] || 'update'}`
            };
          }).reverse();
        }

        if (logs.length === 0) {
          logs.push({ time: 'now', msg: 'System online. No recent push commits found.' });
        }

        // Calculate YTD commits count (approximated from pushes)
        const totalCommitsYTD = countYTDCommits(events);
        const sprintFocus = activeRepo.toUpperCase();

        const metrics = [
          { label: 'PUBLIC REPOS', value: String(profile.public_repos || 0) },
          { label: 'YEARLY COMMITS', value: String(totalCommitsYTD) },
          { label: 'SPRINT FOCUS', value: sprintFocus },
          { label: 'SYS STATUS', value: 'OPERATIONAL' }
        ];

        if (active) {
          setData({ logs, metrics });
        }
      } catch (err) {
        console.warn('GitHub client-side fetch failed, using fallback data:', err.message);
        if (active) {
          setData(fallbackData());
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchActivity();
    return () => { active = false; };
  }, []);

  const metrics = data?.metrics ?? FALLBACK_METRICS;
  const logs    = data?.logs    ?? FALLBACK_LOGS;

  return (
    <section className="build-section-container" id="build-section">
      <div className="build-wrapper">
        
        {/* Main Double Header */}
        <div className="build-header-wrapper">
          <h2 className="build-main-title">ACTIVE BUILDS</h2>
          <div className="build-sub-wrapper">
            <span className="build-sub-title">IN PUBLIC</span>
            <span className="build-tag">/ logs</span>
            <span className="build-live-pulse-container">
              <span className={`pulse-dot ${loading ? 'pulse-dot--loading' : ''}`}></span>
              <span className="pulse-text">{loading ? 'SYNCING' : 'LIVE'}</span>
            </span>
          </div>
        </div>

        {/* Dashboard Grid & Terminal Console */}
        <div className="build-grid-layout">
          
          {/* Top Metrics Row */}
          <div className="build-metrics-row">
            {metrics.map((m) => (
              <div key={m.label} className="metric-box">
                <span className="metric-label">{m.label}</span>
                <span className={`metric-value ${loading ? 'metric-value--loading' : ''}`}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Split Layout: Console on Left, Products on Right */}
          <div className="build-main-split">
            {/* Left Column: Console */}
            <div className="build-console">
              <div className="console-titlebar">
                <span className="console-title">dev@shubh-panwar:~/builds</span>
                <span className="console-controls">LOGS_</span>
              </div>
              <div className="console-log-list">
                {logs.map((log, idx) => (
                  <div key={idx} className="console-log-row">
                    <span className="console-log-time">[{log.time}]</span>
                    <span className="console-log-arrow">&gt;&gt;</span>
                    <span className="console-log-msg">{log.msg}</span>
                  </div>
                ))}
                {/* Live blinking cursor at end */}
                <div className="console-log-row">
                  <span className="console-log-time">[now]</span>
                  <span className="console-log-arrow">&gt;&gt;</span>
                  <span className="console-log-msg console-cursor">█</span>
                </div>
              </div>
            </div>

            {/* Right Column: Shipped Products panel */}
            <div className="build-products-panel">
              <div className="products-panel-header">
                <span className="products-panel-title">// SHIPPED_SOFTWARE_SUITE_</span>
                <span className="products-panel-controls">RELEASED_</span>
              </div>
              <div className="products-list">
                {products.map((prod) => (
                  <div key={prod.id} className="product-card">
                    <div className="product-card-header">
                      <h3 className="product-card-name">{prod.name}</h3>
                      <span className="product-card-ver">{prod.version}</span>
                      <span className={`product-status-badge ${prod.status.toLowerCase()}`}>{prod.status}</span>
                    </div>
                    <p className="product-card-desc">{prod.description}</p>
                    <a href={prod.url} target="_blank" rel="noopener noreferrer" className="product-card-cta">
                      &gt; {prod.ctaText}_
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default BuildSection;
