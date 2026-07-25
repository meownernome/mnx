import { useEffect, useRef } from 'react';

export default function StarfieldBackground({ count = 60 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 80}%`;
      star.style.setProperty('--dur', `${2 + Math.random() * 4}s`);
      star.style.animationDelay = `${Math.random() * 4}s`;
      star.style.opacity = `${0.3 + Math.random() * 0.5}`;
      star.style.transform = `scale(${0.4 + Math.random() * 0.8})`;
      container.appendChild(star);
    }
  }, [count]);

  return (
    <>
      <div className="starfield" ref={containerRef} />
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(91,108,246,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(191,95,255,0.06) 0%, transparent 50%)',
        }}
      />
    </>
  );
}