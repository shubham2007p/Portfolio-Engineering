import React, { useEffect, useRef, useState } from 'react';

// Topics observation content
const nodeContentMap = {
  "computer science": {
    title: "Computer Science",
    content: "Synthesizing computational theory, algorithms, and architecture to build intelligent machines and software ecosystems."
  },
  technology: {
    title: "Technology",
    content: "Advancing digital frontiers through integrated systems, data processing, and the application of scientific principles to create innovative solutions."
  },
  tools: {
    title: "Tools",
    content: "Forging robust developers' environments, automation pipelines, and frameworks to accelerate delivery and scale complexity."
  },
  services: {
    title: "Services",
    content: "Architecting highly available, distributed microservices and API gateways designed for extreme scale and fault tolerance."
  },
  teaching: {
    title: "Teaching",
    content: "Demystifying complex engineering concepts, mentoring next-generation builders, and contributing to open-source knowledge."
  },
  learning: {
    title: "Learning",
    content: "Continuously expanding cognitive frontiers, assimilating novel paradigms, and adapting to the cutting edge of tech."
  },
  projects: {
    title: "Projects",
    content: "Translating concepts into production-grade systems, managing risk, engineering resources, and delivering end-to-end impact."
  },
  building: {
    title: "Building",
    content: "Constructing physical and digital infrastructure with attention to detail, performance, structural integrity, and craft."
  },
  physics: {
    title: "Physics",
    content: "Unraveling the fundamental laws of nature, from quantum mechanics to cosmic structures, to understand the fabric of reality."
  },
  maths: {
    title: "Maths",
    content: "The universal language of logic and patterns, providing the abstract framework that underpins all scientific and engineering systems."
  }
};

function PopupBox({ activeNode, onClose }) {
  const popupRef = useRef(null);
  const [style, setStyle] = useState({ opacity: 0, pointerEvents: 'none' });
  const [content, setContent] = useState({ title: '', content: '' });

  useEffect(() => {
    if (!activeNode) {
      setStyle({ opacity: 0, pointerEvents: 'none' });
      return;
    }

    // Set topic data
    const topicData = nodeContentMap[activeNode.topic] || { title: activeNode.topic, content: '' };
    setContent(topicData);

    const updatePosition = () => {
      const popup = popupRef.current;
      if (!popup) return;

      const boxWidth = popup.offsetWidth || 330;
      const boxHeight = popup.offsetHeight || 150;
      const w = window.innerWidth;
      const h = window.innerHeight;

      const margin = 20;
      let left = activeNode.x;
      let top = activeNode.y - 25; // Base offset above dot

      let tx = -50; // Translate X percentage (default centered)
      let ty = -100; // Translate Y percentage (default above)

      // Horizontal containment checks
      if (left - boxWidth / 2 < margin) {
        // Too close to left: anchor left-side to margin
        const offsetPixels = margin - (left - boxWidth / 2);
        tx = -50 + (offsetPixels / boxWidth) * 100;
      } else if (left + boxWidth / 2 > w - margin) {
        // Too close to right: anchor right-side to margin
        const offsetPixels = (w - margin) - (left + boxWidth / 2);
        tx = -50 + (offsetPixels / boxWidth) * 100;
      }

      // Vertical containment checks
      if (top - boxHeight < margin) {
        // Too close to top: show popup below dot instead
        top = activeNode.y + 25;
        ty = 0;
      }

      setStyle({
        opacity: 1,
        pointerEvents: 'auto',
        left: `${left}px`,
        top: `${top}px`,
        transform: `translate(${tx}%, ${ty}%) scale(1)`
      });
    };

    // Calculate dimensions next frame to allow layout rendering
    const rafId = requestAnimationFrame(updatePosition);

    return () => cancelAnimationFrame(rafId);
  }, [activeNode]);

  return (
    <div 
      ref={popupRef}
      className={`popup-box ${activeNode ? 'active' : ''}`}
      style={style}
    >
      <button 
        className="popup-close" 
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close details"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div className="popup-title">{content.title}</div>
      <p className="popup-content">{content.content}</p>
    </div>
  );
}

export default PopupBox;
