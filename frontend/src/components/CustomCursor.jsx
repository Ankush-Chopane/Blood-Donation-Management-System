import React, { useEffect, useRef, useState } from 'react';

const interactiveSelector = 'a, button, input, select, textarea, [role="button"], .compat-badge, .carousel-btn, .carousel-dot';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const trailRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const trailRefPosition = useRef({ x: 0, y: 0 });
  const frameRef = useRef();
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
    const syncEnabled = () => setEnabled(mediaQuery.matches);

    syncEnabled();
    mediaQuery.addEventListener('change', syncEnabled);

    return () => mediaQuery.removeEventListener('change', syncEnabled);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    const handleMouseMove = (event) => {
      targetRef.current = { x: event.clientX, y: event.clientY };

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const handlePointerOver = (event) => {
      setHovered(Boolean(event.target.closest(interactiveSelector)));
    };

    const animate = () => {
      const target = targetRef.current;
      const trail = trailRefPosition.current;

      trail.x += (target.x - trail.x) * 0.16;
      trail.y += (target.y - trail.y) * 0.16;

      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0) translate(-50%, -50%)`;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerover', handlePointerOver);
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerover', handlePointerOver);
      cancelAnimationFrame(frameRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={trailRef}
        className={`fixed left-0 top-0 pointer-events-none rounded-full border border-secondary z-[99999] transition-[width,height,background-color,border-color] duration-200 ease-out shadow-[0_0_10px_rgba(239,35,60,0.2)] ${
          hovered ? 'w-11 h-11 bg-secondary/10 border-primary' : 'w-7 h-7'
        }`}
      />
      <div
        ref={cursorRef}
        className={`fixed left-0 top-0 pointer-events-none rounded-full bg-secondary z-[100000] transition-[width,height,background-color] duration-100 ease-out shadow-[0_0_8px_rgba(239,35,60,0.5)] ${
          hovered ? 'w-2 h-2 bg-white' : 'w-1.5 h-1.5'
        }`}
      />
    </>
  );
};

export default CustomCursor;
