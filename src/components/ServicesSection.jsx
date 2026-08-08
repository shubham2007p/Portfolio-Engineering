import React from 'react';

function ServicesSection() {
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

        </div>

      </div>
    </section>
  );
}

export default ServicesSection;
