import React, { useState, useEffect } from 'react';

function ServicesSection() {
  const [problem, setProblem] = useState('');
  const [status, setStatus] = useState('idle'); // idle, transmitting, completed
  const [responseText, setResponseText] = useState('');

  const services = [
    {
      num: '01',
      title: 'FULLSTACK ARCHITECTURE',
      desc: 'Building highly performant, robust, and clean web structures. Designing seamless responsive layouts and scalable system integrations.'
    },
    {
      num: '02',
      title: 'MACHINE LEARNING SYSTEMS',
      desc: 'Optimizing transformer attention, engineering ML data pipelines, and deploying distributed model architectures in production.'
    },
    {
      num: '03',
      title: 'CREATIVE CODE & DESIGN',
      desc: 'Fusing physics-driven math with interactive UI environments, magnetic canvas connections, and custom web graphics.'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!problem.trim()) return;

    setStatus('transmitting');
    setResponseText('');

    // Simulate sending packet over grid network
    setTimeout(() => {
      setStatus('completed');
      setProblem('');
    }, 2200);
  };

  // Typewriter effect on completion response
  useEffect(() => {
    if (status !== 'completed') return;

    const fullMessage = '[SYSTEM: DECODING STATEMENT... PACKETS RECEIVED SUCCESSFULLY. SHUBH\'S MIND IS SIMULATING SOLUTIONS. EXPECT AN INTERCEPT SOON.]';
    let currentIdx = 0;
    
    const interval = setInterval(() => {
      setResponseText((prev) => prev + fullMessage[currentIdx]);
      currentIdx++;
      if (currentIdx >= fullMessage.length) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [status]);

  return (
    <section className="services-section-container" id="services-section">
      <div className="services-wrapper">
        
        {/* Main Double Header */}
        <div className="services-header-wrapper">
          <h2 className="services-main-title">CORE CAPABILITIES</h2>
          <div className="services-sub-wrapper">
            <span className="services-sub-title">SERVICES</span>
            <span className="services-tag">/ problem-solver</span>
          </div>
        </div>

        {/* Content Split Grid */}
        <div className="services-grid-split">
          
          {/* Left Column: Services Offered */}
          <div className="services-left">
            {services.map((svc) => (
              <div key={svc.num} className="service-item">
                <div className="service-item-header">
                  <span className="service-item-num">{svc.num}/</span>
                  <h3 className="service-item-title">{svc.title}</h3>
                </div>
                <p className="service-item-desc">{svc.desc}</p>
              </div>
            ))}
          </div>

          {/* Right Column: Problem Solver Terminal Prompt */}
          <div className="services-right">
            <div className="terminal-container">
              <div className="terminal-headerbar">
                <span className="terminal-header-dot red"></span>
                <span className="terminal-header-dot yellow"></span>
                <span className="terminal-header-dot green"></span>
                <span className="terminal-header-title">SOLVER-PROMPT v1.0.9</span>
              </div>
              <div className="terminal-body">
                {status === 'idle' && (
                  <form onSubmit={handleSubmit} className="terminal-form">
                    <label htmlFor="problemInput" className="terminal-label">
                      &gt; INPUT A TOUGH PROBLEM STATEMENT FOR ME TO SOLVE:
                    </label>
                    <textarea
                      id="problemInput"
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      placeholder="e.g. Optimized attention latency for real-time translation..."
                      className="terminal-textarea"
                      required
                    />
                    <button type="submit" className="terminal-submit-btn">
                      &gt; DEPLOY_STATEMENT_
                    </button>
                  </form>
                )}

                {status === 'transmitting' && (
                  <div className="terminal-logs">
                    <div className="log-line blink">&gt; INITIATING ENCRYPTED LINK...</div>
                    <div className="log-line">&gt; PACKET SIZE: {problem.length} BYTES</div>
                    <div className="log-line">&gt; STACKING BUFFER ONTO PORT 8080...</div>
                    <div className="log-line">&gt; TRANSMITTING TO POLYJUNKIE MIND... [RUNNING]</div>
                    <div className="progress-bar-wrapper">
                      <div className="progress-bar-fill"></div>
                    </div>
                  </div>
                )}

                {status === 'completed' && (
                  <div className="terminal-logs">
                    <div className="log-line completed">&gt; TRANSMISSION LINK SECURED.</div>
                    <div className="log-line response-text">{responseText}</div>
                    <button 
                      onClick={() => setStatus('idle')} 
                      className="terminal-reset-btn"
                    >
                      &gt; TRANSMIT NEW STATEMENT
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default ServicesSection;
