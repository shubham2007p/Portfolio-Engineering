import React, { useEffect, useRef } from 'react';

function CursorTrail() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize handler to fit viewport
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Mouse tracking
    const handleMouseMove = (e) => {
      const particleCount = 2; // Create 2 particles per mousemove for a nice stream
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          // Small random drift velocity
          vx: (Math.random() - 0.5) * 1.6,
          vy: (Math.random() - 0.5) * 1.6,
          // Random radius matching dot grid size (2px to 4.5px)
          radius: Math.random() * 2.5 + 2,
          // Opacity parameters
          alpha: 1.0,
          decay: Math.random() * 0.015 + 0.015 // fade out rate
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Mobile touch tracking
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const particleCount = 2;
        for (let i = 0; i < particleCount; i++) {
          particlesRef.current.push({
            x: touch.clientX,
            y: touch.clientY,
            vx: (Math.random() - 0.5) * 1.6,
            vy: (Math.random() - 0.5) * 1.6,
            radius: Math.random() * 2.5 + 2,
            alpha: 1.0,
            decay: Math.random() * 0.015 + 0.015
          });
        }
      }
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        // Using semi-transparent white matching grid styling
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();

        // Remove if faded out
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 50
      }}
    />
  );
}

export default CursorTrail;
