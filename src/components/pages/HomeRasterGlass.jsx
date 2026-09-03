import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import LightColumns from './LightColumns';

const OPEN_PROGRESS = 360;
const CLOSED_PROGRESS = 0;
const DRAG_THRESHOLD = 7;
const SNAP_MIDPOINT = OPEN_PROGRESS / 2;
const RELEASE_PROJECTION = 0.12;
const SOURCE_WIDTH = 1728;
const GLASS_WIDTH = 788;
const LEFT_GLASS_X = -141;
const RIGHT_GLASS_X = 1077;
const LEFT_CLOSED_EDGE = LEFT_GLASS_X + GLASS_WIDTH;

const softenBoundary = (value) => {
  if (value < CLOSED_PROGRESS) return value * 0.18;
  if (value > OPEN_PROGRESS) return OPEN_PROGRESS + (value - OPEN_PROGRESS) * 0.18;
  return value;
};

export default function HomeRasterGlass({ side }) {
  const glassRef = useRef(null);
  const motionRef = useRef({ progress: CLOSED_PROGRESS });
  const gestureRef = useRef({ active: false, moved: false, startPointer: 0, startProgress: 0, lastPointer: 0, lastTime: 0, velocity: 0, scale: 1 });
  const hoverRef = useRef({ active: false, quickTo: null });
  const openStateRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const direction = side === 'left' ? -1 : 1;
  const sideLabel = side === 'left' ? '左侧' : '右侧';

  const updateOpenState = (open) => {
    if (openStateRef.current === open) return;
    openStateRef.current = open;
    setIsOpen(open);
  };

  const applyProgress = (progress) => {
    motionRef.current.progress = progress;
    updateOpenState(progress >= SNAP_MIDPOINT);
    gsap.set(glassRef.current, { x: direction * progress, force3D: true });
  };

  const settle = (open, velocity = 0) => {
    const target = open ? OPEN_PROGRESS : CLOSED_PROGRESS;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    updateOpenState(open);
    gsap.killTweensOf(motionRef.current);

    if (prefersReducedMotion) {
      applyProgress(target);
      return;
    }

    const remaining = Math.abs(target - motionRef.current.progress);
    const speed = Math.min(Math.abs(velocity), 1800);
    const duration = gsap.utils.clamp(0.42, 0.7, 0.64 - speed / 9000 + remaining / 4200);

    gsap.to(motionRef.current, {
      progress: target,
      duration,
      ease: speed > 320 ? 'elastic.out(1, 0.84)' : 'power4.out',
      overwrite: true,
      onUpdate: () => applyProgress(motionRef.current.progress),
    });
  };

  const toggle = () => settle(!openStateRef.current);

  const onPointerDown = (event) => {
    if (window.innerWidth <= 760 || event.button !== 0) return;

    const liveX = Number(gsap.getProperty(glassRef.current, 'x')) || 0;
    gsap.killTweensOf(glassRef.current);
    gsap.killTweensOf(motionRef.current);
    motionRef.current.progress = gsap.utils.clamp(CLOSED_PROGRESS, OPEN_PROGRESS, direction * liveX);
    updateOpenState(motionRef.current.progress >= SNAP_MIDPOINT);
    glassRef.current.setPointerCapture(event.pointerId);
    glassRef.current.classList.add('is-dragging');

    const bounds = glassRef.current.getBoundingClientRect();
    const stageScale = bounds.width / glassRef.current.offsetWidth || 1;
    gestureRef.current = {
      active: true,
      moved: false,
      startPointer: event.clientX,
      startProgress: motionRef.current.progress,
      lastPointer: event.clientX,
      lastTime: performance.now(),
      velocity: 0,
      scale: stageScale,
    };
  };

  const onPointerMove = (event) => {
    const gesture = gestureRef.current;
    if (!gesture.active) return;

    const now = performance.now();
    const elapsed = Math.max(8, now - gesture.lastTime);
    const pointerDelta = (event.clientX - gesture.startPointer) / gesture.scale;
    const nextProgress = softenBoundary(gesture.startProgress + direction * pointerDelta);
    const frameDelta = (event.clientX - gesture.lastPointer) / gesture.scale;

    gesture.moved ||= Math.abs(pointerDelta) > DRAG_THRESHOLD;
    gesture.velocity = direction * (frameDelta / elapsed) * 1000;
    gesture.lastPointer = event.clientX;
    gesture.lastTime = now;
    applyProgress(nextProgress);
  };

  const onPointerUp = (event) => {
    const gesture = gestureRef.current;
    if (!gesture.active) return;

    gesture.active = false;
    if (glassRef.current.hasPointerCapture?.(event.pointerId)) glassRef.current.releasePointerCapture(event.pointerId);
    glassRef.current.classList.remove('is-dragging');

    if (!gesture.moved && event.type !== 'pointercancel') {
      toggle();
      return;
    }

    const projected = motionRef.current.progress + gesture.velocity * RELEASE_PROJECTION;
    settle(projected >= SNAP_MIDPOINT, gesture.velocity);
  };

  const onLostPointerCapture = () => {
    const gesture = gestureRef.current;
    if (!gesture.active) return;

    gesture.active = false;
    glassRef.current.classList.remove('is-dragging');
    settle(motionRef.current.progress >= SNAP_MIDPOINT, gesture.velocity);
  };

  const onKeyDown = (event) => {
    const opensWithKey = (side === 'left' && event.key === 'ArrowLeft') || (side === 'right' && event.key === 'ArrowRight');
    const closesWithKey = (side === 'left' && event.key === 'ArrowRight') || (side === 'right' && event.key === 'ArrowLeft');

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    } else if (event.key === 'Home' || closesWithKey) {
      event.preventDefault();
      settle(false);
    } else if (event.key === 'End' || opensWithKey) {
      event.preventDefault();
      settle(true);
    }
  };

  useEffect(() => {
    const glass = glassRef.current;
    const sourceStage = glass?.closest('.design-stage__source');
    if (!glass || !sourceStage) return undefined;

    const hoverTo = gsap.quickTo(motionRef.current, 'progress', {
      duration: 0.3,
      ease: 'power3.out',
      overwrite: true,
      onUpdate: () => applyProgress(motionRef.current.progress),
    });
    hoverRef.current.quickTo = hoverTo;

    const onStagePointerMove = (event) => {
      if (event.pointerType !== 'mouse' || window.innerWidth <= 760 || gestureRef.current.active) return;

      const stageBounds = sourceStage.getBoundingClientRect();
      const stageScale = stageBounds.width / sourceStage.offsetWidth || 1;
      const pointerX = (event.clientX - stageBounds.left) / stageScale;
      const isInSideZone = side === 'left'
        ? pointerX >= 0 && pointerX <= LEFT_CLOSED_EDGE
        : pointerX >= RIGHT_GLASS_X && pointerX <= SOURCE_WIDTH;

      if (!isInSideZone) {
        if (hoverRef.current.active) {
          hoverRef.current.active = false;
          settle(false);
        }
        return;
      }

      hoverRef.current.active = true;
      const target = side === 'left'
        ? gsap.utils.clamp(CLOSED_PROGRESS, OPEN_PROGRESS, LEFT_CLOSED_EDGE - pointerX)
        : gsap.utils.clamp(CLOSED_PROGRESS, OPEN_PROGRESS, pointerX - RIGHT_GLASS_X);

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) applyProgress(target);
      else hoverTo(target);
    };

    const onStagePointerLeave = () => {
      if (!hoverRef.current.active || gestureRef.current.active) return;
      hoverRef.current.active = false;
      settle(motionRef.current.progress >= SNAP_MIDPOINT);
    };

    sourceStage.addEventListener('pointermove', onStagePointerMove, { passive: true });
    sourceStage.addEventListener('pointerleave', onStagePointerLeave, { passive: true });

    return () => {
      sourceStage.removeEventListener('pointermove', onStagePointerMove);
      sourceStage.removeEventListener('pointerleave', onStagePointerLeave);
      gsap.killTweensOf(glass);
      gsap.killTweensOf(motionRef.current);
      hoverRef.current.quickTo = null;
    };
  }, [direction, side]);

  return (
    <div
      ref={glassRef}
      className={`home-raster-glass home-raster-glass--${side}${isOpen ? ' is-open' : ''}`}
      role="slider"
      tabIndex="0"
      aria-label={`${sideLabel}光栅玻璃，拖动或按回车切换`}
      aria-orientation="horizontal"
      aria-valuemin="0"
      aria-valuemax="1"
      aria-valuenow={isOpen ? 1 : 0}
      aria-valuetext={isOpen ? '打开' : '关闭'}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onLostPointerCapture={onLostPointerCapture}
      onKeyDown={onKeyDown}
    >
      <div className="home-raster-glass__refraction" aria-hidden="true" />
      <LightColumns page="home" className="home-raster-glass__columns" count={16} />
      <span className="home-raster-glass__edge" aria-hidden="true">
        <i />
        <small>{isOpen ? 'PULL TO CLOSE' : 'PULL TO OPEN'}</small>
      </span>
    </div>
  );
}
