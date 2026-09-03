import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Pending = ({ label = 'CONTENT PENDING' }) => <span className="case-pending">待补充 / {label}</span>;

export function ProjectMeta({ project }) {
  const items = [
    ['ROLE', project.role], ['TYPE', project.category], ['YEAR', project.year],
    ['TEAM', project.team || project.organization], ['IMPACT', project.impact], ['LOCATION', project.location],
  ].filter(([, value]) => Boolean(value));
  return <dl className="case-meta">{items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

export function ProjectHero({ project }) {
  const heroImage = project.pages?.[0] || project.cover;
  return (
    <section className="case-hero">
      <div className="case-hero__spectrum" aria-hidden="true" />
      <div className="case-hero__copy">
        <p className="case-eyebrow">PROJECT {project.index} / λ {project.wavelength} NM</p>
        <h1>{project.title}</h1>
        {project.englishTitle && <p className="case-hero__english">{project.englishTitle}</p>}
        <p className="case-hero__summary">{project.summary}</p>
      </div>
      <figure className="case-hero__media">
        <div className="case-hero__glass"><img src={heroImage} alt={`${project.title} 项目封面`} fetchPriority="high" /></div>
        <figcaption>{project.spectrumLabel} / STANDARD WAVELENGTH</figcaption>
      </figure>
      <span className="case-hero__scroll">SCROLL TO EXPLORE <i /></span>
    </section>
  );
}

export function ProjectOverview({ project }) {
  return (
    <section className="case-overview" aria-label="项目概览">
      <div className="case-overview__label"><span>01 / OVERVIEW</span><strong>Project<br />Overview</strong></div>
      <div className="case-overview__story"><p>{project.intro || project.summary}</p><ProjectMeta project={project} /></div>
    </section>
  );
}

export function ProjectPageGallery({ project }) {
  const galleryRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pages = project.pages?.slice(1) || [];
  const titles = project.pageTitles || [];

  useEffect(() => {
    if (!galleryRef.current) return undefined;
    const ctx = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray('.case-project-page').forEach((page, index) => {
          const image = page.querySelector('img');
          gsap.set(image, { autoAlpha: 0.34, scale: 0.985, clipPath: 'inset(4% 0 4% 0)' });
          gsap.to(image, {
            autoAlpha: 1, scale: 1, clipPath: 'inset(0% 0 0% 0)', ease: 'none',
            scrollTrigger: {
              trigger: page, start: 'top 86%', end: 'top 34%', scrub: 0.5,
              onEnter: () => setCurrentPage(index + 1), onEnterBack: () => setCurrentPage(index + 1),
            },
          });
        });
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => media.revert();
    }, galleryRef);
    return () => ctx.revert();
  }, [project.id]);

  const currentTitle = titles[currentPage] || `项目内容 ${currentPage + 1}`;
  return (
    <section ref={galleryRef} className="case-project-gallery" aria-label={`${project.title} 完整项目内容`}>
      <aside className="case-project-rail" aria-hidden="true">
        <span>{String(currentPage + 1).padStart(2, '0')} / {String(project.pages?.length || 0).padStart(2, '0')}</span>
        <b><i style={{ '--page-progress': `${((currentPage + 1) / (project.pages?.length || 1)) * 100}%` }} /></b>
        <em>{currentTitle}</em>
      </aside>
      <div className="case-project-pages">
        {pages.map((src, index) => (
          <figure className="case-project-page" key={src}>
            <figcaption><span>{String(index + 2).padStart(2, '0')}</span><strong>{titles[index + 1] || `项目内容 ${index + 2}`}</strong></figcaption>
            <img src={src} alt={`${project.title} · ${titles[index + 1] || `项目内容第 ${index + 2} 页`}`} loading="lazy" decoding="async" />
          </figure>
        ))}
      </div>
    </section>
  );
}

export function ProjectIntro({ index = '01', title = 'Project Introduction', children }) { return <section className="case-block case-intro"><p className="case-block__index">{index} / INTRO</p><h2>{title}</h2><div className="case-block__body">{children || <Pending label="PROJECT INTRODUCTION" />}</div></section>; }
export function TextSection({ index = '02', title, children }) { return <section className="case-block case-text-section"><p className="case-block__index">{index} / TEXT</p><h2>{title}</h2><div className="case-block__body">{children || <Pending />}</div></section>; }
export function MediaBlock({ src, alt, caption = 'PROJECT MEDIA' }) { return <figure className="case-media-block">{src ? <img src={src} alt={alt || caption} /> : <div className="case-media-placeholder"><Pending label="MEDIA" /></div>}<figcaption>{caption}</figcaption></figure>; }
export function FullBleedMedia(props) { return <div className="case-full-bleed"><MediaBlock {...props} /></div>; }
export function MetricBlock({ metrics = [] }) { return <section className="case-metrics">{metrics.length ? metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>) : <Pending label="METRICS" />}</section>; }
export function ProcessBlock({ steps = [] }) { return <section className="case-process">{steps.length ? steps.map((step, index) => <div key={step.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.copy}</p></div>) : <Pending label="PROCESS" />}</section>; }
export function QuoteBlock({ children, source }) { return <blockquote className="case-quote">{children || <Pending label="QUOTE" />}{source && <cite>{source}</cite>}</blockquote>; }
export function ImageGrid({ images = [] }) { return <div className="case-image-grid">{images.length ? images.map((image) => <MediaBlock key={image.src} {...image} />) : <Pending label="IMAGE GRID" />}</div>; }
export function VideoBlock({ src, poster }) { return <div className="case-video">{src ? <video controls poster={poster} src={src} /> : <Pending label="VIDEO" />}</div>; }

export function NextProject({ project, onNavigate }) {
  const image = project.pages?.[0] || project.cover;
  return (
    <footer className="next-wavelength" style={{ '--next-color': project.primaryColor, '--next-rgb': project.glowRgb }}>
      <p>NEXT WAVELENGTH / {project.index}</p>
      <button type="button" onClick={() => onNavigate(project)} aria-label={`下一个项目：${project.title}`}>
        <span className="next-wavelength__copy"><small>λ {project.wavelength} NM · {project.spectrumLabel}</small><strong>{project.title}</strong><em>{project.category || project.spectrumLabel} <b>VIEW PROJECT ↗</b></em></span>
        <span className="next-wavelength__media"><img src={image} alt={`${project.title} 项目预览`} loading="lazy" /></span>
      </button>
    </footer>
  );
}
