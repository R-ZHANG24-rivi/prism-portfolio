import { useEffect, useRef, useState } from 'react';
import { withBasePath } from '../../utils/paths';

const padProgress = (value) => String(Math.round(value)).padStart(3, '0');

export default function PrismLoader({ assets = [], onComplete }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    let frame;
    let exitTimer;
    let completeTimer;
    let assetsReady = false;
    const startedAt = performance.now();
    const hasVisited = window.sessionStorage.getItem('prism-intro-seen') === '1';
    const minimumDuration = hasVisited ? 480 : 1380;

    document.body.classList.add('is-prism-loading');

    const preloadImage = (src) => new Promise((resolve) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = resolve;
      image.src = src;
    });

    Promise.all([
      ...assets.map(preloadImage),
      document.fonts?.ready || Promise.resolve(),
    ]).finally(() => { assetsReady = true; });

    const finish = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      setProgress(100);
      window.sessionStorage.setItem('prism-intro-seen', '1');
      exitTimer = window.setTimeout(() => setExiting(true), 180);
      completeTimer = window.setTimeout(onComplete, 760);
    };

    const tick = (now) => {
      const elapsed = now - startedAt;
      const timedProgress = Math.min(90, (elapsed / minimumDuration) * 90);
      const waitingProgress = 90 + Math.min(7, Math.max(0, elapsed - minimumDuration) / 260);
      setProgress(Math.floor(elapsed < minimumDuration ? timedProgress : waitingProgress));
      if (elapsed >= minimumDuration && assetsReady) {
        finish();
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(exitTimer);
      window.clearTimeout(completeTimer);
      document.body.classList.remove('is-prism-loading');
    };
  }, [assets, onComplete]);

  return (
    <div className={`prism-loader${exiting ? ' is-exiting' : ''}`} role="status" aria-live="polite" aria-label={`正在加载作品集 ${Math.round(progress)}%`}>
      <div className="prism-loader__top"><span>RIVI ZHANG</span><span>PORTFOLIO / 2026</span></div>
      <div className="prism-loader__optics" aria-hidden="true">
        <span className="prism-loader__white-beam" style={{ transform: `scaleX(${0.22 + progress * 0.0078})` }} />
        <img src={withBasePath('/assets/portfolio/home/prism.png')} alt="" style={{ opacity: 0.18 + progress * 0.006, transform: `translate(-50%,-50%) rotate(${-6 + progress * 0.07}deg)` }} />
        <span className="prism-loader__spectrum" style={{ opacity: progress * 0.008, transform: `scaleX(${progress * 0.01})` }} />
      </div>
      <div className="prism-loader__word" aria-hidden="true"><span>PRI</span><i>SM</i></div>
      <div className="prism-loader__status">
        <span>{progress < 100 ? 'CALIBRATING LIGHT' : 'SPECTRUM READY'}</span>
        <strong>{padProgress(progress)}</strong>
      </div>
      <div className="prism-loader__rail" aria-hidden="true"><i style={{ '--loader-progress': `${progress}%` }} /></div>
    </div>
  );
}
