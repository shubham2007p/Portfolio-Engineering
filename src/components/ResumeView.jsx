import React from 'react';

function ResumeView({ onClose }) {
  return (
    <div className="resume-overlay-container">
      
      {/* Top Floating Control Bar */}
      <div className="resume-control-bar">
        <div className="resume-page-header-title">RESUME</div>
        <button className="resume-close-btn" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>CLOSE / back to site</span>
        </button>
      </div>

      {/* Main Resume Sheet */}
      <div className="resume-sheet">
        
        {/* Header Section */}
        <header className="resume-header">
          <h1 className="resume-name">Shubham Panwar</h1>
          <p className="resume-title">Python Developer - ML/AI Engineer</p>
          <div className="resume-contact-links">
            <a href="mailto:shubhworking1004@gmail.com" className="resume-link">shubhworking1004@gmail.com</a>
            <span className="bullet-dot">•</span>
            <span className="resume-phone">+91 97111 97804</span>
            <span className="bullet-dot">•</span>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="resume-link bold-link">LINKEDIN</a>
            <span className="bullet-dot">•</span>
            <a href="https://github.com/shubh-panwar" target="_blank" rel="noopener noreferrer" className="resume-link bold-link">GITHUB</a>
          </div>
        </header>

        {/* Section: EDUCATION */}
        <section className="resume-section">
          <h2 className="resume-section-title">EDUCATION</h2>
          <div className="resume-item">
            <div className="resume-item-header">
              <span className="item-title">B.Tech – Computer Science & Engineering (AI/ML)</span>
              <span className="item-meta">Greater Noida GNIOT (Aff. AKTU), 2025 – 2029</span>
            </div>
            <ul className="resume-bullets">
              <li>Specialization in Artificial Intelligence and Machine Learning.</li>
              <li>Relevant coursework: Data Structures, Algorithms, Probability & Statistics, Linear Algebra, Machine Learning.</li>
              <li>NPTEL: Mathematics for Machine Learning — ongoing certification course.</li>
            </ul>
          </div>
        </section>

        {/* Section: PROJECTS */}
        <section className="resume-section">
          <h2 className="resume-section-title">PROJECTS</h2>
          <div className="resume-item">
            <div className="resume-item-header">
              <span className="item-title">Parking Management System</span>
              <span className="item-meta">Python, MySQL, CSV — <a href="https://github.com/shubham2007p/parking-system" target="_blank" rel="noopener noreferrer" className="item-link">github.com/shubham2007p/parking-system</a></span>
            </div>
            <ul className="resume-bullets">
              <li>Built a role-based CLI system to automate vehicle entry/exit, real-time slot allocation, and billing for a multi-pillar parking facility.</li>
              <li>Implemented role-based access control across 4 employee tiers (Security Guard, Supervisor, Manager, Tech Support) with secure credential login.</li>
              <li>Designed a dynamic billing engine computing charges by slot size and duration (₹0.50–₹1.00/sec), with full bill generation and DB storage.</li>
              <li>Engineered auto-slot assignment based on vehicle size (Small/Medium/Large) with live vacancy tracking across MySQL tables.</li>
              <li>Added CSV export for date-range data statements and complete employee activity logging (login/logout, record modifications).</li>
              <li>Planned future extensions: Flask/Django web UI, payment gateway integration, and analytics dashboard.</li>
            </ul>
          </div>
        </section>

        {/* Section: CERTIFICATIONS */}
        <section className="resume-section">
          <h2 className="resume-section-title">CERTIFICATIONS</h2>
          
          <div className="resume-cert-row">
            <div className="cert-info">
              <span className="cert-title">Scientific Computing with Python</span>
              <span className="cert-issuer"> — Freedcamp</span>
              <span className="cert-desc">Skills: Python, Scientific Computing • ~300 hours of hands-on learning •</span>
            </div>
            <span className="cert-date">Dec 2025</span>
          </div>

          <div className="resume-cert-row">
            <div className="cert-info">
              <span className="cert-title">Accelerating Deep Learning with GPUs</span>
              <span className="cert-issuer"> — IBM / Cognitive Class</span>
              <span className="cert-desc">Skills: Deep Learning, GPU Architecture, Parallel Computing, Distributed Deep Learning</span>
            </div>
            <span className="cert-date">Dec 2025</span>
          </div>

          <div className="resume-cert-row">
            <div className="cert-info">
              <span className="cert-title">Building AI-Powered Search with MongoDB Vector Search</span>
              <span className="cert-issuer"> — MongoDB</span>
              <span className="cert-desc">Skills: AI, MongoDB, Vector Databases, Semantic Search, Vector Embeddings</span>
            </div>
            <span className="cert-date">Dec 2025</span>
          </div>
        </section>

        {/* Section: TECHNICAL SKILLS */}
        <section className="resume-section">
          <h2 className="resume-section-title">TECHNICAL SKILLS</h2>
          <div className="resume-skills-grid">
            
            <div className="skills-row">
              <span className="skills-key">Languages:</span>
              <span className="skills-val">Python (primary), SQL, C, Web-dev</span>
            </div>

            <div className="skills-row">
              <span className="skills-key">ML/AI:</span>
              <span className="skills-val">NumPy, Pandas, Scikit-learn, TensorFlow, PyTorch (learning), Matplotlib</span>
            </div>

            <div className="skills-row">
              <span className="skills-key">Python Depth:</span>
              <span className="skills-val">OOP, file I/O, datetime, MySQL connector, CSV module; working toward idiomatic/systems-level Python</span>
            </div>

            <div className="skills-row">
              <span className="skills-key">Databases:</span>
              <span className="skills-val">MySQL, MongoDB</span>
            </div>

            <div className="skills-row">
              <span className="skills-key">Tools:</span>
              <span className="skills-val">Git, GitHub, VS Code, Jupyter Notebook</span>
            </div>

            <div className="skills-row">
              <span className="skills-key">Mathematics:</span>
              <span className="skills-val">Linear Algebra, Calculus, Probability & Statistics — applied to ML models</span>
            </div>

            <div className="skills-row">
              <span className="skills-key">CS Concepts:</span>
              <span className="skills-val">Data Structures, Algorithms, Role-Based Access Control, Systems Thinking</span>
            </div>

          </div>
        </section>

        {/* Section: CURRENTLY LEARNING */}
        <section className="resume-section">
          <h2 className="resume-section-title">CURRENTLY LEARNING</h2>
          <ul className="resume-bullets">
            <li>Fluent Python & High Performance Python — idiomatic and systems-level Python mastery.</li>
            <li>Designing ML Systems (Chip Huyen) — production ML pipelines, feature stores, model deployment.</li>
            <li>AI Engineering (Chip Huyen) — LLM application development and evaluation.</li>
            <li>Build a Large Model From Scratch (Raschka) — transformer internals from first principles.</li>
            <li>d2l.ai — deep learning with mathematical depth and working code.</li>
          </ul>
        </section>

        {/* Section: INTERESTS & PHILOSOPHY */}
        <section className="resume-section">
          <h2 className="resume-section-title">INTERESTS & PHILOSOPHY</h2>
          <div className="resume-philosophy">
            <p className="philosophy-text">
              Polymath-minded cross-disciplinary learner who connects mathematics, physics, and computer science — 
              finding the underlying patterns that unify them. Learns by building, prefers first-principles thinking over surface-level 
              tutorials, and approaches ML as applied mathematics brought to life through code.
            </p>
            <div className="skills-row">
              <span className="skills-key">Interests:</span>
              <span className="skills-val">Mathematical physics, probability theory, neural architecture, competitive programming, open-source contribution</span>
            </div>
          </div>
        </section>

        {/* Call to Action: HIRE THIS TALENT */}
        <div className="resume-cta-container">
          <a href="mailto:shubhworking1004@gmail.com?subject=Opportunity%20at%20[Company]" className="resume-hire-btn">
            <span>HIRE THIS TALENT</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>

      </div>
    </div>
  );
}

export default ResumeView;
