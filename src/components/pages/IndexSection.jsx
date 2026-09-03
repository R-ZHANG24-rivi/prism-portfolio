import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { withBasePath } from '../../utils/paths';

gsap.registerPlugin(ScrollTrigger);

const clamp = gsap.utils.clamp(-3, 3);

export default function IndexSection({ projects, onOpenProject }) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const prismRef = useRef(null);
  const cardsRef = useRef([]);
  const routeTimerRef = useRef(null);
  const activeRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pendingProject, setPendingProject] = useState(null);
  const activeProject = projects[activeIndex];

  const updateActive = (index) => {
    if (index === activeRef.current) return;
    activeRef.current = index;
    setActiveIndex(index);
  };

  const renderOrbit = (rawIndex, animate = false) => {
    const cards = cardsRef.current.filter(Boolean);
    const setter = animate ? gsap.to : gsap.set;
    cards.forEach((card, index) => {
      const delta = clamp(index - rawIndex);
      const distance = Math.abs(delta);
      setter(card, {
        x: delta * window.innerWidth * 0.31,
        y: distance * 38 + delta * 8,
        scale: Math.max(0.5, 1 - distance * 0.2),
        rotationY: 0,
        rotationZ: 0,
        opacity: Math.max(0.1, 1 - distance * 0.3),
        zIndex: 20 - Math.round(distance * 3),
        filter: `brightness(${Math.max(0.42, 1 - distance * 0.2)}) saturate(${Math.max(0.45, 1 - distance * 0.18)})`,
        duration: animate ? 0.75 : 0,
        ease: 'power3.out',
        overwrite: true,
      });
    });
  };

  useEffect(() => {
    if (!rootRef.current || !stageRef.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.set(cardsRef.current, { xPercent: -50, yPercent: -50, transformOrigin: '50% 50%' });
      renderOrbit(0);
      const media = gsap.matchMedia();

      media.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)', () => {
        ScrollTrigger.create({
          trigger: rootRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * (projects.length - 1) * 0.9}`,
          pin: stageRef.current,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: projects.length > 1 ? {
            snapTo: 1 / (projects.length - 1),
            duration: { min: 0.18, max: 0.55 },
            delay: 0.08,
            ease: 'power2.inOut',
          } : false,
          onUpdate: (self) => {
            const rawIndex = self.progress * (projects.length - 1);
            renderOrbit(rawIndex);
            updateActive(Math.round(rawIndex));
            gsap.set(prismRef.current, {
              rotation: -4 + self.progress * 11,
              scale: 0.98 + Math.sin(self.progress * Math.PI) * 0.035,
            });
          },
        });
      });

      media.add('(max-width: 760px), (prefers-reduced-motion: reduce)', () => {
        gsap.set(cardsRef.current, { clearProps: 'transform,opacity,filter,zIndex' });
        cardsRef.current.filter(Boolean).forEach((card, index) => ScrollTrigger.create({
          trigger: card,
          start: 'top 62%',
          end: 'bottom 38%',
          onEnter: () => updateActive(index),
          onEnterBack: () => updateActive(index),
        }));
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        if (['#index', '#work'].includes(window.location.hash) && Math.abs(rootRef.current.getBoundingClientRect().top) > 2) {
          rootRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      });
      return () => media.revert();
    }, rootRef);
    return () => ctx.revert();
  }, [projects]);

  useEffect(() => () => window.clearTimeout(routeTimerRef.current), []);

  const activate = (index) => {
    updateActive(index);
    if (window.innerWidth > 760 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.to(prismRef.current, {
        rotation: -4 + index * 2.75,
        scale: 1 + index * 0.006,
        duration: 0.8,
        ease: 'power3.out',
        overwrite: true,
      });
    }
  };

  const openProject = (project) => {
    if (pendingProject) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onOpenProject(project);
      return;
    }
    setPendingProject(project);
    routeTimerRef.current = window.setTimeout(() => onOpenProject(project), 760);
  };

  return (
    <section ref={rootRef} className="journey-index index-orbit" id="work" data-active-index={activeIndex} aria-labelledby="journey-index-title" style={{ '--index-color': activeProject.primaryColor, '--index-rgb': activeProject.glowRgb }}>
      <div ref={stageRef} className="index-orbit__stage">
        <div className="index-orbit__grain" aria-hidden="true" />
        <header className="index-orbit__header">
          <p>03 / SELECTED WORK</p>
          <h2 id="journey-index-title"><span>Selected</span><br />Work</h2>
          <small>项目 / {String(projects.length).padStart(2, '0')} WAVELENGTHS</small>
        </header>

        <div className="index-orbit__optics" aria-hidden="true">
          <span className="index-orbit__beam" />
          <img ref={prismRef} src={withBasePath('/assets/portfolio/home/prism.png')} alt="" />
          <i />
        </div>

        <div className="index-orbit__track" aria-label="项目目录">
          {projects.map((project, index) => (
            <button
              ref={(node) => { cardsRef.current[index] = node; }}
              type="button"
              key={project.id}
              className={`index-orbit__card${index === activeIndex ? ' is-active' : ''}`}
              style={{ '--card-color': project.primaryColor, '--card-rgb': project.glowRgb }}
              aria-label={`${project.index} ${project.title}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onPointerEnter={() => activate(index)}
              onFocus={() => activate(index)}
              onClick={() => openProject(project)}
            >
              <span className="index-orbit__image">
                <img src={project.pages?.[0] || project.preview} alt={`${project.title} 项目缩略图`} />
              </span>
              <span className="index-orbit__card-meta"><b>{project.index}</b><em>λ {project.wavelength} NM</em></span>
            </button>
          ))}
        </div>

        <div className="index-orbit__active-copy" key={activeProject.id} aria-live="polite">
          <span>{activeProject.index} / λ {activeProject.wavelength} NM</span>
          <strong>{activeProject.title}</strong>
          <small>{activeProject.category || activeProject.spectrumLabel}</small>
        </div>

        <div className="index-orbit__progress" aria-hidden="true"><b style={{ '--progress': `${((activeIndex + 1) / projects.length) * 100}%` }} /><span>{String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span></div>
        <p className="index-orbit__hint">SCROLL TO SELECT · HOVER TO FOCUS · CLICK TO ENTER</p>
      </div>

      {pendingProject && <div className="index-route-transition is-active" style={{ '--route-rgb': pendingProject.glowRgb, '--route-color': pendingProject.primaryColor }} aria-hidden="true"><img src={pendingProject.pages?.[0] || pendingProject.preview} alt="" /></div>}
    </section>
  );
}
