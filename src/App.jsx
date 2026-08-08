import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import InteractiveWeb from './components/InteractiveWeb';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import BlogSection from './components/BlogSection';
import ServicesSection from './components/ServicesSection';
import BuildSection from './components/BuildSection';
import ConnectSection from './components/ConnectSection';
import ResumeView from './components/ResumeView';
import SocialBar from './components/SocialBar';
import Footer from './components/Footer';
import CursorTrail from './components/CursorTrail';
import { postApi } from './hooks/useApi';

function App() {
  const [view, setView] = useState('portfolio'); // 'portfolio' or 'resume'
  const [activeTab, setActiveTab] = useState('homepage');
  const [profileHovered, setProfileHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollYRef = useRef(window.scrollY);
  
  // Footer Idea Form States
  const [footerEmail, setFooterEmail] = useState('');
  const [footerIdea, setFooterIdea] = useState('');
  const [footerStatus, setFooterStatus] = useState('idle');
  const [footerError, setFooterError] = useState('');

  const handleFooterSubmit = async (e) => {
    e.preventDefault();
    if (!footerEmail || !footerIdea) {
      setFooterError('Please fill out all fields.');
      return;
    }
    setFooterStatus('sending');
    setFooterError('');

    const { ok, error } = await postApi('/api/contact', {
      name: 'Footer Idea Form',
      email: footerEmail,
      message: footerIdea
    });

    if (ok) {
      setFooterStatus('sent');
      setFooterEmail('');
      setFooterIdea('');
    } else {
      setFooterStatus('error');
      setFooterError(error || 'Something went wrong.');
    }
  };
  
  const scrollContainerRef = useRef(null);
  const cursorGlowRef = useRef(null);
  const bgGridRef = useRef(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Monitor visibility of the contact form to conditionally blur the premium footer
  useEffect(() => {
    // Only set up observer in portfolio view where form exists
    if (view === 'resume') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFormVisible(entry.isIntersecting);
      },
      { threshold: 0.15 } // Trigger blur when 15% of the form block is visible
    );

    const formElement = document.querySelector('.connect-wrapper');
    if (formElement) {
      observer.observe(formElement);
    }

    return () => {
      if (formElement) observer.unobserve(formElement);
    };
  }, [view]);

  // Monitor mousemove to position cursor glow point-light and apply grid parallax
  useEffect(() => {
    const glow = cursorGlowRef.current;
    const grid = bgGridRef.current;

    const handleMouseMove = (e) => {
      if (glow) {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      }
      if (grid) {
        const dx = (e.clientX - window.innerWidth / 2) * -0.02;
        const dy = (e.clientY - window.innerHeight / 2) * -0.02;
        grid.style.setProperty('--grid-x', `${dx}px`);
        grid.style.setProperty('--grid-y', `${dy}px`);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;
        if (glow) {
          glow.style.left = `${clientX}px`;
          glow.style.top = `${clientY}px`;
        }
        if (grid) {
          const dx = (clientX - window.innerWidth / 2) * -0.02;
          const dy = (clientY - window.innerHeight / 2) * -0.02;
          grid.style.setProperty('--grid-x', `${dx}px`);
          grid.style.setProperty('--grid-y', `${dy}px`);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Monitor scroll behavior for page snapping & transitions
  useEffect(() => {
    const handleScroll = () => {
      // If we are in the resume view, ignore scrollytelling progress calculations
      if (view === 'resume') return;

      const scrollY = window.scrollY;
      const h = window.innerHeight;
      
      const grid = bgGridRef.current;
      if (grid) {
        const scrollParallaxY = -scrollY * 0.08;
        grid.style.setProperty('--grid-scroll-y', `${scrollParallaxY}px`);
      }

      // With 7 sections (Homepage, About, Projects, Blog, Services, Build, Connect), Y ranges from 0 to 6.0 * h
      const progress = scrollY / h; 
      setScrollProgress(progress);

      // Show header on scroll up, hide on scroll down
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 50 || currentScrollY < lastScrollYRef.current) {
        setNavHidden(false);
      } else if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
        setNavHidden(true);
      }
      lastScrollYRef.current = currentScrollY;

      // Highlight active tab based on scroll progress boundaries
      if (progress < 0.5) {
        setActiveTab('homepage');
      } else if (progress >= 0.5 && progress < 1.5) {
        setActiveTab('about');
      } else if (progress >= 1.5 && progress < 2.5) {
        setActiveTab('projects');
      } else if (progress >= 2.5 && progress < 3.5) {
        setActiveTab('blog');
      } else if (progress >= 3.5 && progress < 4.5) {
        setActiveTab('services');
      } else if (progress >= 4.5 && progress < 5.5) {
        setActiveTab('build');
      } else {
        setActiveTab('connect');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [view]);

  // Jump to specific section on tab click
  const handleTabChange = (tabId) => {
    setView('portfolio');
    setActiveTab(tabId);
    let targetScrollY = 0;
    if (tabId === 'about') {
      targetScrollY = window.innerHeight;
    } else if (tabId === 'projects') {
      targetScrollY = window.innerHeight * 2;
    } else if (tabId === 'blog') {
      targetScrollY = window.innerHeight * 3;
    } else if (tabId === 'services') {
      targetScrollY = window.innerHeight * 4;
    } else if (tabId === 'build') {
      targetScrollY = window.innerHeight * 5;
    } else if (tabId === 'connect') {
      targetScrollY = window.innerHeight * 6;
    }
    
    setTimeout(() => {
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth'
      });
    }, 50);
  };

  // Determine dynamic footer explore trigger callback
  const handleExploreClick = () => {
    let targetScrollY = 0;
    if (scrollProgress < 0.5) {
      targetScrollY = window.innerHeight;
    } else if (scrollProgress >= 0.5 && scrollProgress < 1.5) {
      targetScrollY = window.innerHeight * 2;
    } else if (scrollProgress >= 1.5 && scrollProgress < 2.5) {
      targetScrollY = window.innerHeight * 3;
    } else if (scrollProgress >= 2.5 && scrollProgress < 3.5) {
      targetScrollY = window.innerHeight * 4;
    } else if (scrollProgress >= 3.5 && scrollProgress < 4.5) {
      targetScrollY = window.innerHeight * 5;
    } else if (scrollProgress >= 4.5 && scrollProgress < 5.5) {
      targetScrollY = window.innerHeight * 6;
    } else {
      targetScrollY = 0;
    }

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  };

  // Determine center footer link content
  const exploreText = scrollProgress >= 5.5 ? "BACK TO TOP" : "SCROLL TO EXPLORE";

  // Scrollytelling cross-fade and lift calculations
  const aboutOpacity = Math.max(0, 1 - Math.abs(scrollProgress - 1.0) * 1.5);
  const aboutOffset = (1 - aboutOpacity) * 40;

  const projectsOpacity = Math.max(0, 1 - Math.abs(scrollProgress - 2.0) * 1.5);
  const projectsOffset = (1 - projectsOpacity) * 40;

  const blogOpacity = Math.max(0, 1 - Math.abs(scrollProgress - 3.0) * 1.5);
  const blogOffset = (1 - blogOpacity) * 40;

  const servicesOpacity = Math.max(0, 1 - Math.abs(scrollProgress - 4.0) * 1.5);
  const servicesOffset = (1 - servicesOpacity) * 40;

  const buildOpacity = Math.max(0, 1 - Math.abs(scrollProgress - 5.0) * 1.5);
  const buildOffset = (1 - buildOpacity) * 40;

  const connectOpacity = Math.max(0, 1 - Math.abs(scrollProgress - 6.0) * 1.5);
  const connectOffset = (1 - connectOpacity) * 40;

  return (
    <>
      {/* Background Dots Grid */}
      <div className="bg-grid" ref={bgGridRef}></div>

      {/* Persistent Bulb Cursor Glow */}
      <div className="cursor-glow" ref={cursorGlowRef}></div>

      {/* Fullscreen Interactive Cursor Particle Trail */}
      <CursorTrail />

      {/* Navigation Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={handleTabChange}
        setProfileHovered={setProfileHovered}
        navHidden={navHidden}
        onProfileClick={() => setView(view === 'resume' ? 'portfolio' : 'resume')}
      />

      {view === 'resume' ? (
        <ResumeView onClose={() => setView('portfolio')} />
      ) : (
        <>
          {/* Main Node Web Physics Viewport (Locks as fixed background) */}
          <InteractiveWeb 
            profileHovered={profileHovered}
            scrollProgress={scrollProgress}
          />

          {/* Right Floating Social Bar Capsule (Hides past Homepage) */}
          {!navHidden && <SocialBar />}

          {/* Footer Details (Visible throughout the pages) */}
          <Footer 
            onExploreClick={handleExploreClick} 
            exploreText={exploreText}
          />

          {/* Scrollable Container (Snaps Homepage -> About -> Projects -> Blog -> Services -> Build -> Connect) */}
          <div className="scroll-content-container" ref={scrollContainerRef}>
            
            {/* Section 1: Homepage */}
            <section id="homepage" className="scroll-section">
              {/* Spacer block, graphics render in fixed overlay */}
            </section>

            {/* Section 2: About Page */}
            <section 
              id="about" 
              className="scroll-section"
              style={{ 
                opacity: aboutOpacity,
                transform: `translate3d(0, ${aboutOffset}px, 0)`,
                willChange: 'opacity, transform'
              }}
            >
              <AboutSection />
            </section>

            {/* Section 3: Projects Page */}
            <section 
              id="projects" 
              className="scroll-section"
              style={{ 
                opacity: projectsOpacity,
                transform: `translate3d(0, ${projectsOffset}px, 0)`,
                willChange: 'opacity, transform'
              }}
            >
              <ProjectsSection />
            </section>

            {/* Section 4: Blog Page */}
            <section 
              id="blog" 
              className="scroll-section"
              style={{ 
                opacity: blogOpacity,
                transform: `translate3d(0, ${blogOffset}px, 0)`,
                willChange: 'opacity, transform'
              }}
            >
              <BlogSection />
            </section>

            {/* Section 5: Services Page */}
            <section 
              id="services" 
              className="scroll-section"
              style={{ 
                opacity: servicesOpacity,
                transform: `translate3d(0, ${servicesOffset}px, 0)`,
                willChange: 'opacity, transform'
              }}
            >
              <ServicesSection />
            </section>

            {/* Section 6: Build In Public Page */}
            <section 
              id="build" 
              className="scroll-section"
              style={{ 
                opacity: buildOpacity,
                transform: `translate3d(0, ${buildOffset}px, 0)`,
                willChange: 'opacity, transform'
              }}
            >
              <BuildSection />
            </section>

            {/* Section 7: Connect Page */}
            <section 
              id="connect" 
              className="scroll-section"
              style={{ 
                opacity: connectOpacity,
                transform: `translate3d(0, ${connectOffset}px, 0)`,
                willChange: 'opacity, transform'
              }}
            >
              <ConnectSection />
            </section>

            {/* Premium Brutalist Footer */}
            <footer id="site-footer">
              {/* Background Ghost Text */}
              <div className="footer-ghost-text">SHUBH</div>

              <div className="footer-content-grid">
                
                {/* Left Column: Headline and Idea Input */}
                <div className="footer-left-block">
                  <span className="footer-cta-label">/ COLLABORATION</span>
                  <h2 className="footer-headline">Have an Idea?<br /><span className="text-gold">let's build it</span></h2>
                  
                  {footerStatus === 'sent' ? (
                    <div className="contact-success" style={{ fontFamily: 'var(--font-mono)' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '1.2rem', height: '1.2rem', color: '#7fffb0', stroke: '#7fffb0' }}>
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ fontSize: '0.8rem', color: '#ffffff' }}>IDEA TRANSMITTED. Talk soon!</span>
                    </div>
                  ) : (
                    <form className="footer-idea-form" onSubmit={handleFooterSubmit} noValidate>
                      <div className="footer-form-field">
                        <input
                          type="email"
                          placeholder="email"
                          className="footer-form-input"
                          value={footerEmail}
                          onChange={(e) => setFooterEmail(e.target.value)}
                          disabled={footerStatus === 'sending'}
                          required
                        />
                      </div>
                      <div className="footer-form-field">
                        <textarea
                          placeholder="explain the idea"
                          className="footer-form-input footer-form-textarea"
                          rows={3}
                          value={footerIdea}
                          onChange={(e) => setFooterIdea(e.target.value)}
                          disabled={footerStatus === 'sending'}
                          required
                        />
                      </div>
                      {footerStatus === 'error' && (
                        <p className="contact-error" style={{ margin: '0 0 1rem 0' }}>{footerError}</p>
                      )}
                      <button 
                        type="submit" 
                        className={`contact-submit ${footerStatus === 'sending' ? 'contact-submit--sending' : ''}`}
                        disabled={footerStatus === 'sending'}
                        style={{ marginTop: '0.5rem' }}
                      >
                        {footerStatus === 'sending' ? (
                          'TRANSMITTING…'
                        ) : (
                          <>
                            SEND IDEA
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '0.9rem', height: '0.9rem', marginLeft: '0.6rem', transition: 'transform 0.3s ease' }}>
                              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>

                {/* Right Column: Links and Info */}
                <div className="footer-right-block">
                  <div className="footer-nav-grid">
                    <div className="footer-col">
                      <span className="col-label">01 // NAVIGATION</span>
                      <a href="#homepage" className="footer-link" onClick={() => handleTabChange('homepage')}>Home</a>
                      <a href="#about" className="footer-link" onClick={() => handleTabChange('about')}>About</a>
                      <a href="#projects" className="footer-link" onClick={() => handleTabChange('projects')}>Projects</a>
                      <a href="#blog" className="footer-link" onClick={() => handleTabChange('blog')}>Blog</a>
                    </div>
                    <div className="footer-col">
                      <span className="col-label">02 // SOCIALS</span>
                      <a href="https://github.com/shubh-panwar" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
                      <a href="https://www.linkedin.com/in/shubham-panwar-9324b02a8/" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
                      <a href="#" onClick={(e) => e.preventDefault()} style={{ cursor: 'default' }} className="footer-link">Twitter</a>
                      <a href="mailto:shubhamworking1004@gmail.com" className="footer-link">Email</a>
                    </div>
                    <div className="footer-col">
                      <span className="col-label">03 // DOMAINS</span>
                      <span className="footer-info-val">Creative Algorithms</span>
                      <span className="footer-info-val">Neural Dynamics</span>
                      <span className="footer-info-val">Systems Architecture</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Copyright and Coordinates */}
              <div className="footer-bottom-meta">
                <span>© 2026 SHUBHAM PANWAR. ALL RIGHTS RESERVED.</span>
                <span>LOC: DELHI, INDIA // 28.6139° N, 77.2090° E</span>
              </div>
            </footer>

          </div>
        </>
      )}
    </>
  );
}

export default App;
