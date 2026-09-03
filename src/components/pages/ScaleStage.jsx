import { useEffect, useState } from 'react';

const SOURCE_WIDTH = 1728;
const SOURCE_HEIGHT = 1117;
const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 720;

export default function ScaleStage({ className = '', children, fitViewport = false, fullBleed = false, preserveSourceRatio = false }) {
  const fixedQaViewport = new URLSearchParams(window.location.search).get('qa') === '1728';
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
  const sourceScale = DESIGN_WIDTH / SOURCE_WIDTH;
  const stageHeight = preserveSourceRatio ? SOURCE_HEIGHT * sourceScale : DESIGN_HEIGHT;

  const getScale = ({ width, height }) => {
    if (fixedQaViewport) return 1;
    if (fitViewport && width > 760) return Math.min(width / DESIGN_WIDTH, height / stageHeight);
    return width / DESIGN_WIDTH;
  };

  const scale = getScale(viewport);
  const stageLeft = fitViewport && viewport.width > 760
    ? Math.max(0, (viewport.width - DESIGN_WIDTH * scale) / 2)
    : 0;
  const stageTop = fitViewport && viewport.width > 760
    ? Math.max(0, (viewport.height - stageHeight * scale) / 2)
    : 0;
  const viewportHeight = fixedQaViewport
    ? stageHeight
    : fullBleed
      ? viewport.height
      : fitViewport && viewport.width > 760
      ? viewport.height
      : stageHeight * scale;

  useEffect(() => {
    const resize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', resize, { passive: true });
    document.documentElement.classList.toggle('qa-viewport', fixedQaViewport);
    return () => {
      window.removeEventListener('resize', resize);
      document.documentElement.classList.remove('qa-viewport');
    };
  }, [fixedQaViewport]);

  return (
    <div className={`stage-viewport${fitViewport ? ' stage-viewport--fit' : ''}${fullBleed ? ' stage-viewport--full-bleed' : ''}`} style={{ width: fixedQaViewport ? `${DESIGN_WIDTH}px` : '100%', height: `${viewportHeight}px` }}>
      <div
        className={`design-stage ${className}`}
        style={{ width: `${DESIGN_WIDTH}px`, height: `${stageHeight}px`, left: `${stageLeft}px`, top: `${stageTop}px`, transform: `scale(${scale})` }}
      >
        <div
          className="design-stage__source"
          style={{
            width: `${SOURCE_WIDTH}px`,
            height: `${SOURCE_HEIGHT}px`,
            transform: preserveSourceRatio
              ? `scale(${sourceScale})`
              : `scale(${sourceScale}, ${DESIGN_HEIGHT / SOURCE_HEIGHT})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
