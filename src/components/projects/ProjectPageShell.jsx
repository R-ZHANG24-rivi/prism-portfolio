import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PortfolioNav from '../pages/PortfolioNav';
import {
  NextProject,
  ProjectHero,
  ProjectOverview,
  ProjectPageGallery,
} from './CaseBlocks';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectPageShell({ project, nextProject, onClose, onNavigate }) {
  const pageRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${project.title} | 张睿作品集`;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let media;
      if (!reduceMotion) {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .to('.case-entry-veil img', { scale: 1.025, autoAlpha: 0, duration: 0.48 }, 0)
          .to('.case-entry-veil', { autoAlpha: 0, duration: 0.52 }, 0.18)
          .from('.case-hero__copy > *', { y: 34, autoAlpha: 0, stagger: 0.08, duration: 0.72 }, 0.26)
          .from('.case-hero__media', { y: 34, scale: 0.97, autoAlpha: 0, duration: 0.9 }, 0.34)
          .from('.case-hero__scroll', { autoAlpha: 0, duration: 0.5 }, 0.8);

        media = gsap.matchMedia();
        media.add('(min-width: 761px)', () => {
          const reveal = gsap.timeline({
            scrollTrigger: {
              trigger: '.case-hero',
              start: 'top top',
              end: () => `+=${window.innerHeight * 0.82}`,
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          reveal
            .to('.case-hero__copy', { xPercent: -15, autoAlpha: 0.08, ease: 'none' }, 0)
            .to('.case-hero__media', { x: () => window.innerWidth * -0.14, scale: 1.34, transformOrigin: '68% 50%', ease: 'none' }, 0)
            .to('.case-hero__media figcaption, .case-hero__scroll', { autoAlpha: 0, ease: 'none' }, 0)
            .to('.case-hero__spectrum', { scale: 1.25, opacity: 0.52, ease: 'none' }, 0);
          return () => reveal.kill();
        });
      } else {
        gsap.set('.case-entry-veil', { display: 'none' });
      }
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => media?.revert();
    }, pageRef);

    return () => {
      ctx.revert();
      document.title = '张睿作品集 | PRISM';
    };
  }, [project]);

  return (
    <article
      ref={pageRef}
      className="case-page"
      style={{
        '--project-color': project.primaryColor,
        '--project-rgb': project.glowRgb,
        '--project-glow': project.glowColor,
        '--project-spectrum': project.spectrumColor,
        '--project-glass': project.glassTint,
      }}
    >
      <div className="case-entry-veil" aria-hidden="true">
        <img src={project.pages?.[0] || project.cover} alt="" />
        <i />
      </div>
      <PortfolioNav />
      <button className="case-back" type="button" onClick={onClose}>← SELECTED WORK</button>
      <ProjectHero project={project} />
      <ProjectOverview project={project} />

      <main className="case-content case-content--project-pages">
        <ProjectPageGallery project={project} />
      </main>

      <NextProject project={nextProject} onNavigate={onNavigate} />
    </article>
  );
}
