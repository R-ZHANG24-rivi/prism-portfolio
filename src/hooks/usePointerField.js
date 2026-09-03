import { useEffect, useRef } from 'react';

export function usePointerField() {
  const pointer = useRef({
    x: 0, y: 0, nx: 0, ny: 0,
    rawX: 0, rawY: 0, rawNx: 0, rawNy: 0,
    velocityX: 0, velocityY: 0, active: false,
  });

  useEffect(() => {
    let frame;
    const update = (event) => {
      pointer.current.rawX = event.clientX;
      pointer.current.rawY = event.clientY;
      pointer.current.rawNx = event.clientX / window.innerWidth * 2 - 1;
      pointer.current.rawNy = -(event.clientY / window.innerHeight * 2 - 1);
      pointer.current.active = true;
    };
    const leave = () => { pointer.current.active = false; };
    const tick = () => {
      const p = pointer.current;
      const previousX = p.x;
      const previousY = p.y;
      p.x += (p.rawX - p.x) * .105;
      p.y += (p.rawY - p.y) * .105;
      p.nx += (p.rawNx - p.nx) * .075;
      p.ny += (p.rawNy - p.ny) * .075;
      p.velocityX += ((p.x - previousX) - p.velocityX) * .16;
      p.velocityY += ((p.y - previousY) - p.velocityY) * .16;
      document.documentElement.style.setProperty('--pointer-x', `${p.x}px`);
      document.documentElement.style.setProperty('--pointer-y', `${p.y}px`);
      document.documentElement.style.setProperty('--pointer-nx', p.nx.toFixed(4));
      document.documentElement.style.setProperty('--pointer-ny', p.ny.toFixed(4));
      document.documentElement.style.setProperty('--spectrum-shift', `${(p.nx * 18).toFixed(2)}px`);
      document.documentElement.style.setProperty('--pointer-vx', `${Math.max(-18, Math.min(18, p.velocityX))}deg`);
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', update, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    tick();
    return () => {
      window.removeEventListener('pointermove', update);
      document.documentElement.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(frame);
    };
  }, []);
  return pointer;
}
