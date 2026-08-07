import React, { useEffect, useRef, useState } from 'react';
import PopupBox from './PopupBox';

// Node topics and configurations
const spatialNodes = [
  { id: 'cs', label: 'computer science', topic: 'computer science' },
  { id: 'tech', label: 'technology', topic: 'technology' },
  { id: 'tools', label: 'tools', topic: 'tools' },
  { id: 'services', label: 'services', topic: 'services' },
  { id: 'teaching', label: 'teaching', topic: 'teaching' },
  { id: 'learning', label: 'learning', topic: 'learning' },
  { id: 'projects', label: 'projects', topic: 'projects' },
  { id: 'building', label: 'building', topic: 'building' },
  { id: 'physics', label: 'physics', topic: 'physics' },
  { id: 'maths', label: 'maths', topic: 'maths' }
];

function InteractiveWeb({ profileHovered, scrollProgress }) {
  const [activeNode, setActiveNode] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [pulsingNodeId, setPulsingNodeId] = useState(null);

  // living-pulse periodic trigger logic
  useEffect(() => {
    let pulseTimeout;
    const triggerPulse = () => {
      const randomNode = spatialNodes[Math.floor(Math.random() * spatialNodes.length)];
      setPulsingNodeId(randomNode.id);
      setTimeout(() => setPulsingNodeId(null), 2500);
      pulseTimeout = setTimeout(triggerPulse, Math.random() * 5000 + 5000);
    };
    pulseTimeout = setTimeout(triggerPulse, 5000);
    return () => clearTimeout(pulseTimeout);
  }, []);

  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const svgRef = useRef(null);
  const profileLineRef = useRef(null);

  // Store DOM elements of the nodes and lines
  const nodeRefs = useRef([]);
  const lineRefs = useRef([]);

  // Store coordinates, velocities, anchors, and noise variables for the physics loop
  // Done in refs to avoid causing React state updates at 60fps
  const nodesPhysicsRef = useRef(
    spatialNodes.map((n, idx) => ({
      id: n.id,
      topic: n.topic,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      anchorX: 0,
      anchorY: 0,
      noiseOffsetX: Math.random() * 1000,
      noiseOffsetY: Math.random() * 1000,
      index: idx
    }))
  );

  // Track mouse coordinates
  const mouseRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
    inViewport: false
  });

  // Calculate anchors
  const calculateAnchors = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const centerX = w / 2;
    const centerY = h / 2;

    // Radius parameters for node positioning circle/ellipse
    const rx = Math.min(w * 0.38, 480);
    const ry = Math.min(h * 0.34, 250);
    const startAngle = -Math.PI * 0.35; // Clockwise offset starting at CS (top right)

    nodesPhysicsRef.current.forEach((node, i) => {
      const angle = startAngle + (i * (2 * Math.PI / nodesPhysicsRef.current.length));
      node.anchorX = centerX + rx * Math.cos(angle);
      node.anchorY = centerY + ry * Math.sin(angle);

      // Set starting coordinate if uninitialized
      if (node.x === 0 && node.y === 0) {
        node.x = node.anchorX;
        node.y = node.anchorY;
      }
    });
  };

  useEffect(() => {
    calculateAnchors();

    // Event handlers
    const handleResize = () => {
      calculateAnchors();
      if (activeNode) {
        // Trigger popup reposition by forcing popup updates
        setActiveNode(prev => prev ? { ...prev } : null);
      }
    };

    const handleMouseMove = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.inViewport = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.inViewport = false;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouseRef.current.targetX = e.touches[0].clientX;
        mouseRef.current.targetY = e.touches[0].clientY;
        mouseRef.current.inViewport = true;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Animation variables
    let animationFrameId;
    let time = 0;
    const spring = 0.04;
    const damping = 0.85;
    const driftStrength = 12;
    const repelRadius = 100; // Magnetic field range
    const repelStrength = 10; // Positive value represents soft attraction (magnetic snap)

    // Main animation loop
    const tick = () => {
      time += 1.5;

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // Get central title geometry
      const titleEl = titleRef.current;
      if (!titleEl) {
        animationFrameId = requestAnimationFrame(tick);
        return;
      }

      const titleRect = titleEl.getBoundingClientRect();
      const titleCenterX = titleRect.left + titleRect.width / 2;
      const titleCenterY = titleRect.top + titleRect.height / 2;

      // Update node physics (drift, mouse attraction, spring target)
      nodesPhysicsRef.current.forEach((node, idx) => {
        // 1. Organic drifting (drift offsets based on time)
        const noiseX = Math.sin(time * 0.005 + node.noiseOffsetX) * driftStrength;
        const noiseY = Math.cos(time * 0.006 + node.noiseOffsetY) * driftStrength;

        let targetX = node.anchorX + noiseX;
        let targetY = node.anchorY + noiseY;

        // 2. Cursor magnetic snap physics (attraction)
        if (mouse.inViewport) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.hypot(dx, dy);

          if (dist < repelRadius) {
            const force = (repelRadius - dist) / repelRadius;
            // Draw node towards cursor (magnetic snap)
            const ax = (dx / dist) * force * repelStrength;
            const ay = (dy / dist) * force * repelStrength;
            targetX += ax;
            targetY += ay;
          }
        }

        // 3. Spring and Damping
        const ax = (targetX - node.x) * spring;
        const ay = (targetY - node.y) * spring;

        node.vx = (node.vx + ax) * damping;
        node.vy = (node.vy + ay) * damping;

        node.x += node.vx;
        node.y += node.vy;

        // 4. Update Node DOM Element style directly (bypassing React render for 60fps)
        const nodeEl = nodeRefs.current[idx];
        if (nodeEl) {
          nodeEl.style.left = `${node.x}px`;
          nodeEl.style.top = `${node.y}px`;
        }
      });

      // 5. Update Connection line points
      // We sort the nodes by horizontal X position first so connections never cross.
      const sortedByX = [...nodesPhysicsRef.current]
        .map((node, originalIndex) => ({ node, originalIndex }))
        .sort((a, b) => a.node.x - b.node.x);

      sortedByX.forEach(({ node, originalIndex }, sortedIdx) => {
        const ratio = 0.12 + (sortedIdx / (nodesPhysicsRef.current.length - 1)) * 0.76;
        const startX = titleRect.left + titleRect.width * ratio;
        const startY = titleCenterY;

        const lineEl = lineRefs.current[originalIndex];
        if (lineEl) {
          lineEl.setAttribute('x1', startX);
          lineEl.setAttribute('y1', startY);
          lineEl.setAttribute('x2', node.x);
          lineEl.setAttribute('y2', node.y);
        }
      });

      // 6. Profile button line rendering
      const profileBtn = document.getElementById('userProfileBtn');
      const profileLine = profileLineRef.current;
      if (profileBtn && profileLine) {
        const pRect = profileBtn.getBoundingClientRect();
        const px = pRect.left + pRect.width / 2;
        const py = pRect.top + pRect.height / 2;

        const tx = titleRect.right;
        const ty = titleCenterY;

        profileLine.setAttribute('x1', px);
        profileLine.setAttribute('y1', py);
        profileLine.setAttribute('x2', tx);
        profileLine.setAttribute('y2', ty);

        if (profileHovered) {
          const offset = -time * 0.4;
          profileLine.style.strokeDashoffset = `${offset}px`;
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    // Cleanups on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [profileHovered]);

  const handleNodeClick = (e, node) => {
    e.stopPropagation();
    if (activeNode && activeNode.id === node.id) {
      setActiveNode(null);
    } else {
      // Find current physics coords to position popup accurately
      const physics = nodesPhysicsRef.current.find(n => n.id === node.id);
      setActiveNode({
        ...node,
        x: physics ? physics.x : window.innerWidth / 2,
        y: physics ? physics.y : window.innerHeight / 2
      });
    }
  };

  // Close popup globally when clicking empty space
  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveNode(null);
    };
    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  // Fade out smoothly (fully invisible at 33% scroll progress) to prevent page overlap
  const opacity = Math.max(0, 1 - scrollProgress * 3.0);

  return (
    <div 
      className={`viewport-container ${hoveredNodeId ? 'has-hovered-node' : ''}`}
      ref={containerRef}
      style={{ 
        opacity, 
        pointerEvents: 'none', // Always pass background events to scrolling layer
        transition: 'opacity 0.15s ease-out'
      }}
    >
      {/* Fullscreen SVGs */}
      <svg 
        className={`connections-svg ${hoveredNodeId ? 'has-hovered-node' : ''}`} 
        ref={svgRef}
      >
        {spatialNodes.map((node, index) => (
          <line
            key={node.id}
            ref={el => lineRefs.current[index] = el}
            className={`connection-line ${hoveredNodeId === node.id ? 'active-connection' : ''}`}
          />
        ))}
        {/* User profile connection line */}
        <line
          ref={profileLineRef}
          className={`profile-connection-line ${profileHovered ? 'active' : ''}`}
          id="profileConnectionLine"
        />
      </svg>

      {/* Central Brand Header text */}
      <div className="center-title-wrapper">
        <h1 className="center-title" ref={titleRef}>
          ENGINEERING
        </h1>
      </div>

      {/* Dynamic Nodes Container */}
      <div className="nodes-container">
        {spatialNodes.map((node, index) => (
          <div
            key={node.id}
            id={`node-${node.id}`}
            ref={el => nodeRefs.current[index] = el}
             className={`node ${activeNode && activeNode.id === node.id ? 'active-clicked' : ''} ${pulsingNodeId === node.id ? 'node-pulsing' : ''}`}
            onMouseEnter={() => setHoveredNodeId(node.id)}
            onMouseLeave={() => setHoveredNodeId(null)}
            onClick={(e) => handleNodeClick(e, node)}
          >
            <div className="node-dot"></div>
            <span className="node-label">{node.label}</span>
          </div>
        ))}
      </div>

      {/* Observation Modal Info Box */}
      <PopupBox 
        activeNode={activeNode} 
        onClose={() => setActiveNode(null)} 
      />
    </div>
  );
}

export default InteractiveWeb;
