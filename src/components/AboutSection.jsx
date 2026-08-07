import React, { useState, useEffect } from 'react';

function AboutSection() {
  const roles = ["Engineer", "Builder", "Learner", "Problem Solver"];
  const [displayText, setDisplayText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const roles = ["Engineer", "Builder", "Learner", "Problem Solver"];
    let currentRoleIdx = 0;
    let currentText = "";
    let isDeletingText = false;
    let timerId;

    const typeLoop = () => {
      const currentFullText = roles[currentRoleIdx];
      
      if (!isDeletingText) {
        currentText = currentFullText.substring(0, currentText.length + 1);
        setDisplayText(currentText);

        if (currentText === currentFullText) {
          isDeletingText = true;
          timerId = setTimeout(typeLoop, 2000);
        } else {
          timerId = setTimeout(typeLoop, 100);
        }
      } else {
        currentText = currentFullText.substring(0, currentText.length - 1);
        setDisplayText(currentText);

        if (currentText === "") {
          isDeletingText = false;
          currentRoleIdx = (currentRoleIdx + 1) % roles.length;
          setRoleIndex(currentRoleIdx);
          timerId = setTimeout(typeLoop, 200);
        } else {
          timerId = setTimeout(typeLoop, 50);
        }
      }
    };

    timerId = setTimeout(typeLoop, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  return (
    <section className="about-section-container" id="about-section">
      <div className="about-content">
        
        {/* Large Statement Text */}
        <h2 className="about-hero">
          <span className="other-words">{roleIndex === 0 ? "An " : "A "}</span>
          <span className="hover-engineer">
            {displayText}
            <svg className="scribble-highlight" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
              <path className="scribble-path" d="M -2 15 Q 25 5, 50 15 T 102 12" />
            </svg>
          </span>
          <span className="other-words">
            <br />
            refining the interplay between
            <br />
            System, Creativity & Impact
          </span>
        </h2>

        {/* Supporting Paragraph */}
        <p className="about-supporting-paragraph">
          I'm a Computer Science student exploring how AI, software engineering and systems thinking intersect. I enjoy turning ideas into products, learning across disciplines, and continuously refining how I build.
        </p>

        {/* Bottom Details Grid Table */}
        <div className="about-details-grid">
          
          <div className="details-col">
            <span className="details-header">WHO</span>
            <span className="details-value">Shubham Panwar</span>
          </div>

          <div className="details-col">
            <span className="details-header">WHAT</span>
            <span className="details-value">Engineer</span>
          </div>

          <div className="details-col">
            <span className="details-header">WHERE</span>
            <span className="details-value">India, Delhi</span>
          </div>

          <div className="details-col">
            <span className="details-header">HOW</span>
            <span className="details-value">Polyjunkie Mind</span>
          </div>

          <div className="details-col">
            <span className="details-header">STATUS</span>
            <span className="details-value">Available</span>
          </div>

        </div>

      </div>
    </section>
  );
}

export default AboutSection;
