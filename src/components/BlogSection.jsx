import React from 'react';

function BlogSection() {
  const topics = [
    { text: 'Machine Learning', isItalic: false, num: '01' },
    { text: 'Transformers', isItalic: true, num: '02' },
    { text: 'Computer Science', isItalic: false, num: '03' },
    { text: 'Generative Models', isItalic: true, num: '04' },
    { text: 'Systems Design', isItalic: false, num: '05' },
    { text: 'Neural Dynamics', isItalic: true, num: '06' },
    { text: 'Mathematical Logic', isItalic: false, num: '07' },
    { text: 'Creative Algorithms', isItalic: true, num: '08' }
  ];

  const genres = [
    { text: 'Deep Learning', highlighted: true },
    { text: 'Reinforcement Learning', highlighted: false },
    { text: 'Compiler Optimization', highlighted: false },
    { text: 'Computer Vision', highlighted: false },
    { text: 'Natural Language Processing', highlighted: false },
    { text: 'Theory of Computation', highlighted: false },
    { text: 'Statistical Physics', highlighted: false }
  ];

  return (
    <section className="blog-section-container" id="blog-section">
      
      {/* Giant Low-Opacity Watermark in Background */}
      <div className="blog-watermark">TRANSFORMERS</div>

      <div className="blog-content-wrapper">
        
        {/* Main Flowing Typographic Topic List */}
        <div className="blog-topics-flow">
          {topics.map((topic, index) => (
            <React.Fragment key={index}>
              <span className={`blog-topic-item ${topic.isItalic ? 'italic-serif' : 'regular-serif'}`}>
                {topic.text}
                <span className="blog-topic-num">{topic.num}</span>
              </span>
              {index < topics.length - 1 && <span className="blog-separator"> / </span>}
            </React.Fragment>
          ))}
        </div>

        {/* Seamless Genre Capsules Marquee */}
        <div className="marquee-container">
          <div className="marquee-content">
            {/* First Set of Capsules */}
            {genres.map((genre, idx) => (
              <div key={`g1-${idx}`} className={`genre-capsule ${genre.highlighted ? 'highlighted' : ''}`}>
                {genre.highlighted && <span className="capsule-badge">Trending</span>}
                <span>{genre.text}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </div>
            ))}
            {/* Cloned Second Set for Seamless Looping */}
            {genres.map((genre, idx) => (
              <div key={`g2-${idx}`} className={`genre-capsule ${genre.highlighted ? 'highlighted' : ''}`}>
                {genre.highlighted && <span className="capsule-badge">Trending</span>}
                <span>{genre.text}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default BlogSection;
