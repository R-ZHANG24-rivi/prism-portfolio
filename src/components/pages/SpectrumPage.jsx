import { useEffect, useRef, useState } from 'react';
import PortfolioNav from './PortfolioNav';
import IndexSection from './IndexSection';

function SpectrumSlices({ count = 20 }) {
  return <div className="spectrum-slices" aria-hidden="true">{Array.from({ length: count }, (_, index) => <i key={index} style={{ '--slice': index }} />)}</div>;
}

function OpticalPreview({ project, visible, previewRef }) {
  return (
    <aside ref={previewRef} className={`optical-preview${visible ? ' is-visible' : ''}`} aria-hidden="true">
      <div className="optical-preview__dispersion" />
      <div className="optical-preview__glass">
        <img src={project.preview} alt="" />
      </div>
      <div className="optical-preview__readout"><span>λ {project.wavelength} NM</span><b>{project.spectrumLabel}</b></div>
    </aside>
  );
}

function FeaturedProject({ project, onOpen }) {
  return (
    <article className="featured-project" style={{ '--item-color': project.primaryColor, '--item-rgb': project.glowRgb }}>
      <div className="featured-project__copy">
        <p>{project.index} / {project.spectrumLabel} / λ {project.wavelength} NM</p>
        <h2>{project.title}</h2>
        <div className="featured-project__meta"><span>{project.category || project.spectrumLabel}</span><span>{project.year || 'SELECTED WORK'}</span></div>
      </div>
      <button type="button" onClick={() => onOpen(project)} aria-label={`打开项目 ${project.title}`}>
        <img src={project.cover} alt={`${project.title} 项目封面`} />
        <span>VIEW CASE ↗</span>
      </button>
    </article>
  );
}

export function WorkSection({ projects, onNavigate, onContinue }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [pendingProject, setPendingProject] = useState(null);
  const previewRef = useRef(null);
  const routeTimerRef = useRef(null);
  const activeProject = projects[activeIndex];

  useEffect(() => {
    return () => window.clearTimeout(routeTimerRef.current);
  }, []);

  const movePreview = (event) => {
    if (!previewRef.current) return;
    const previewWidth = previewRef.current.offsetWidth;
    const previewHeight = previewRef.current.offsetHeight;
    const x = Math.max(16, Math.min(event.clientX + 24, window.innerWidth - previewWidth - 16));
    const y = Math.max(
      20,
      Math.min(event.clientY - previewHeight / 2, window.innerHeight - previewHeight - 36),
    );

    previewRef.current.style.setProperty('--pointer-x', `${x}px`);
    previewRef.current.style.setProperty('--pointer-y', `${y}px`);
  };

  const openProject = (project) => {
    if (pendingProject) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onNavigate(`/work/${project.slug}`);
      return;
    }
    setPendingProject(project);
    routeTimerRef.current = window.setTimeout(() => onNavigate(`/work/${project.slug}`), 680);
  };

  return (
    <section
      className="spectrum-page journey-work"
      id="work"
      style={{ '--active-color': activeProject.primaryColor, '--active-rgb': activeProject.glowRgb, '--active-glass': activeProject.glassTint }}
      onPointerMove={movePreview}
    >
      <section className="spectrum-opening">
        <div className="spectrum-opening__light" aria-hidden="true" />
        <SpectrumSlices />
        <p className="prism-kicker">03 / PROJECT INDEX / SELECTED WORKS</p>
        <h1><span>SPECTRUM</span><small>SELECTED WORKS</small></h1>
        <p className="spectrum-opening__intro">同一束光，在不同问题中折射为不同波长。<br />THE SAME BLACK UNIVERSE. DIFFERENT WAVELENGTHS.</p>
        <a href="#project-index" className="spectrum-scroll">EXPLORE THE INDEX <i /></a>
      </section>

      <section className="spectrum-index" id="project-index" aria-labelledby="spectrum-index-title">
        <div className="spectrum-index__header">
          <p>INDEX / {String(projects.length).padStart(2, '0')} PROJECTS</p>
          <h2 id="spectrum-index-title">Selected<br /><span>Wavelengths</span></h2>
        </div>
        <div
          className="spectrum-project-list"
          onPointerLeave={() => setPreviewVisible(false)}
          onPointerEnter={() => setPreviewVisible(true)}
        >
          {projects.map((project, index) => (
            <button
              type="button"
              key={project.id}
              className={index === activeIndex ? 'is-active' : ''}
              style={{ '--row-color': project.primaryColor }}
              onPointerEnter={() => { setActiveIndex(index); setPreviewVisible(true); }}
              onFocus={() => { setActiveIndex(index); setPreviewVisible(true); }}
              onClick={() => openProject(project)}
            >
              <span>{project.index}</span>
              <strong>{project.title}</strong>
              <small>{project.category || project.spectrumLabel}</small>
              <time>{project.year || 'SELECTED WORK'}</time>
              <em>λ {project.wavelength}</em>
            </button>
          ))}
        </div>
        <OpticalPreview project={activeProject} visible={previewVisible} previewRef={previewRef} />
      </section>

      <section className="featured-projects" aria-label="Featured Projects">
        <div className="featured-projects__heading"><p>FEATURED / LARGE FORMAT</p><h2>Projects<br /><span>in focus.</span></h2></div>
        {projects.map((project) => <FeaturedProject key={project.id} project={project} onOpen={openProject} />)}
      </section>

      <footer className="spectrum-exit">
        <p>04 / AFTER HOURS</p>
        <button type="button" onClick={() => onContinue?.('beyond')}>BEYOND <span>→</span></button>
      </footer>

      {pendingProject && (
        <div
          className="project-route-transition is-active"
          style={{ '--route-rgb': pendingProject.glowRgb, '--route-color': pendingProject.primaryColor }}
          aria-hidden="true"
        ><img src={pendingProject.pages?.[0] || pendingProject.preview} alt="" /></div>
      )}
    </section>
  );
}

export default function SpectrumPage({ projects, onNavigate }) {
  useEffect(() => {
    document.title = 'Spectrum | 张睿作品集';
    return () => { document.title = '张睿作品集 | PRISM'; };
  }, []);

  return (
    <main className="spectrum-overview-page">
      <PortfolioNav />
      <IndexSection projects={projects} onOpenProject={(project) => onNavigate(`/work/${project.slug}`)} />
    </main>
  );
}
