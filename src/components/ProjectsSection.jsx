import React from 'react';

function ProjectsSection() {
  const projects = [
    {
      id: 'proj-cpu',
      bgColor: '#f6f5f0', // Cream/off-white
      backdropColor: '#bfbeb5', // Darker cream shadow
      badge: 'PROJ-24',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
        </svg>
      )
    },
    {
      id: 'proj-terminal',
      bgColor: '#d95829', // Orange/rust
      backdropColor: '#963614', // Darker orange/rust
      badge: 'PROJ-24',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 8h20" />
          <path d="M6 6h.01M10 6h.01M14 6h.01" />
          <path d="M7 12l3 3-3 3M13 18h4" />
        </svg>
      )
    },
    {
      id: 'proj-gears',
      bgColor: '#516885', // Blue-gray
      backdropColor: '#304154', // Darker blue-gray
      badge: 'PROJ-24',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    },
    {
      id: 'proj-robot-arm',
      bgColor: '#409895', // Teal
      backdropColor: '#246361', // Darker teal
      badge: 'PROJ-24',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 22h8" />
          <rect x="4" y="16" width="4" height="6" />
          <path d="M6 16v-6" />
          <circle cx="6" cy="9" r="1.5" />
          <path d="M7.5 9l6-3" />
          <circle cx="14" cy="5.5" r="1.5" />
          <path d="M14.5 7l3.5 5" />
          <circle cx="18" cy="12.5" r="1.5" />
          <path d="M18.5 14v4M17.5 18h2" />
          <path d="M19 19.5v2.5l-1-1-1 1v-2.5" />
        </svg>
      )
    }
  ];

  return (
    <section className="projects-section-container" id="projects-section">
      <div className="projects-showcase-wrapper">
        
        {/* Main Double Heading */}
        <div className="projects-header-wrapper">
          <h2 className="projects-main-title">ENGINEERED</h2>
          <div className="projects-sub-wrapper">
            <span className="projects-sub-title">SOLUTIONS</span>
            <span className="projects-tag">/ projects</span>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="projects-grid">
          {projects.map((proj) => (
            <div 
              key={proj.id}
              className="project-card"
              style={{ 
                '--card-color': proj.bgColor,
                '--backdrop-color': proj.backdropColor 
              }}
            >
              {/* Darker 3D Backdrop Folder Layer */}
              <div className="project-card-backdrop" />
              
              {/* Main Card Front Body */}
              <div className="project-card-body">
                <div className="project-card-icon-container">
                  {proj.icon}
                </div>
                <div className="project-card-badge-container">
                  <span className="project-card-badge">{proj.badge}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default ProjectsSection;
