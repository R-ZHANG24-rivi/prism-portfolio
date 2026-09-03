import { useEffect, useRef } from 'react';

export default function OpticalHUD({ pointer, chapter, project }) {
  const coordinates = useRef(null);
  useEffect(() => {
    let frame;
    const tick = () => {
      if (coordinates.current) {
        const x = String(Math.round(pointer.current.x)).padStart(4, '0');
        const y = String(Math.round(pointer.current.y)).padStart(4, '0');
        coordinates.current.textContent = `${x} / ${y}`;
      }
      frame = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(frame);
  }, [pointer]);

  return (
    <aside className="optical-hud" aria-label="光学场景状态">
      <span>λ {project.wavelength} NM</span>
      <span>{chapter}</span>
      <span ref={coordinates}>0000 / 0000</span>
    </aside>
  );
}
