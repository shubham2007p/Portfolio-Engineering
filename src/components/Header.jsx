import React, { useState, useEffect } from 'react';

function Header({ activeTab, setActiveTab, setProfileHovered, navHidden, onProfileClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className={`header ${navHidden ? 'nav-hidden' : ''}`}>
        {/* Hamburger button (visible on mobile only, positioned left of header) */}
        <button
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="header-left">
          <button className="logo" onClick={() => { setActiveTab('homepage'); setIsMobileMenuOpen(false); }}>
            shubh
          </button>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-link ${activeTab === 'homepage' ? 'active' : ''}`}
            onClick={() => setActiveTab('homepage')}
          >
            001/HOMEPAGE
          </button>
          <button
            className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            002/ABOUT
          </button>
          <button
            className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            003/PROJECTS
          </button>
          <button
            className={`nav-link ${activeTab === 'blog' ? 'active' : ''}`}
            onClick={() => setActiveTab('blog')}
          >
            004/BLOG
          </button>
          <button
            className={`nav-link ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            005/SERVICES
          </button>
          <button
            className={`nav-link ${activeTab === 'build' ? 'active' : ''}`}
            onClick={() => setActiveTab('build')}
          >
            006/BUILD
          </button>
          <button
            className={`nav-link ${activeTab === 'connect' ? 'active' : ''}`}
            onClick={() => setActiveTab('connect')}
          >
            007/CONNECT
          </button>
        </nav>

        <div className="header-right">
          {/* User profile button */}
          <button
            className="user-profile-btn"
            id="userProfileBtn"
            aria-label="User Profile"
            onMouseEnter={() => setProfileHovered(true)}
            onMouseLeave={() => setProfileHovered(false)}
            onClick={onProfileClick}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay drawer */}
      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
        <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>

          {/* Close button at top right */}
          <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <nav className="mobile-nav-links">
            <button
              className={`mobile-nav-link ${activeTab === 'homepage' ? 'active' : ''}`}
              onClick={() => { setActiveTab('homepage'); setIsMobileMenuOpen(false); }}
            >
              001/HOMEPAGE
            </button>
            <button
              className={`mobile-nav-link ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => { setActiveTab('about'); setIsMobileMenuOpen(false); }}
            >
              002/ABOUT
            </button>
            <button
              className={`mobile-nav-link ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => { setActiveTab('projects'); setIsMobileMenuOpen(false); }}
            >
              003/PROJECTS
            </button>
            <button
              className={`mobile-nav-link ${activeTab === 'blog' ? 'active' : ''}`}
              onClick={() => { setActiveTab('blog'); setIsMobileMenuOpen(false); }}
            >
              004/BLOG
            </button>
            <button
              className={`mobile-nav-link ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => { setActiveTab('services'); setIsMobileMenuOpen(false); }}
            >
              005/SERVICES
            </button>
            <button
              className={`mobile-nav-link ${activeTab === 'build' ? 'active' : ''}`}
              onClick={() => { setActiveTab('build'); setIsMobileMenuOpen(false); }}
            >
              006/BUILD
            </button>
            <button
              className={`mobile-nav-link ${activeTab === 'connect' ? 'active' : ''}`}
              onClick={() => { setActiveTab('connect'); setIsMobileMenuOpen(false); }}
            >
              007/CONNECT
            </button>
          </nav>

          <div className="mobile-drawer-footer">
            {/* Horizontal socials list */}
            <div className="mobile-socials-row">
              <a href="https://github.com/shubh-panwar" target="_blank" rel="noopener noreferrer" className="mobile-social-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/shubham-panwar-9324b02a8/" target="_blank" rel="noopener noreferrer" className="mobile-social-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ cursor: 'default' }} className="mobile-social-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="mobile-social-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" />
                </svg>
              </a>
            </div>

            <a href="mailto:shubhamworking1004@gmail.com" className="mobile-email-link">
              Email me
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
