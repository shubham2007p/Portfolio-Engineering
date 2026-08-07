import React from 'react';
import { useApi } from '../hooks/useApi';

// Fallback data shown before API responds or if it fails
const FALLBACK_METRICS = [
  { label: 'PUBLIC REPOS', value: '—' },
  { label: 'COMMITS (YTD)', value: '—' },
  { label: 'SPRINT FOCUS', value: 'PORTFOLIO' },
  { label: 'SYS STATUS', value: 'STABLE' }
];
const FALLBACK_LOGS = [
  { time: '—', msg: 'Connecting to GitHub API…' }
];

function BuildSection() {
  const { data, loading } = useApi('/api/github/activity', {}, null);

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

          {/* Scrolling Terminal Dev Log Console */}
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

        </div>

      </div>
    </section>
  );
}

export default BuildSection;
