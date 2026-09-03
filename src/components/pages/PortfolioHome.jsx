import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import DisplayTitle from './DisplayTitle';
import HomeRasterGlass from './HomeRasterGlass';
import IndexSection from './IndexSection';
import PortfolioNav from './PortfolioNav';
import ScaleStage from './ScaleStage';
import { AboutStage } from './AboutPage';
import { BeyondSection } from './BeyondPage';
import { EndingSection } from './EndingPage';
import useJourneyNavigation from './useJourneyNavigation';

export default function PortfolioHome({ onNavigate, projects }) {
  const rootRef = useRef(null);
  const { currentSection, scrollToSection } = useJourneyNavigation();

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .from('.portfolio-nav', { autoAlpha: 0, y: -14, duration: 0.55 })
        .fromTo('.home-entry-beam', { autoAlpha: 0, x: -1180, scaleX: 0.12 }, { autoAlpha: 1, x: 1040, scaleX: 1, duration: 0.86, ease: 'power2.inOut' }, 0.05)
        .to('.home-entry-beam', { autoAlpha: 0, x: 1480, duration: 0.34, ease: 'power2.in' }, 0.72)
        .from('.home-glows', { autoAlpha: 0, scaleX: 0.72, transformOrigin: '50% 50%', duration: 0.95 }, 0.34)
        .from('.prism-shadow', { autoAlpha: 0, duration: 0.72 }, 0.38)
        .from('.prism-visual', { autoAlpha: 0, x: -26, rotation: -1.6, transformOrigin: '50% 50%', duration: 0.92 }, 0.42)
        .from('.portfolio-word .display-letter', { autoAlpha: 0, y: 34, stagger: 0.035, duration: 0.62 }, 0.54)
        .from('.home-name span', { autoAlpha: 0, y: 18, stagger: 0.08, duration: 0.55 }, 0.72)
        .from('.home-statement p, .design-link', { autoAlpha: 0, y: 14, stagger: 0.08, duration: 0.56 }, 0.86)
        .from('.home-raster-glass--left', { autoAlpha: 0, x: -170, duration: 0.82 }, 0.62)
        .from('.home-raster-glass--right', { autoAlpha: 0, x: 170, duration: 0.82 }, 0.62);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef} className="portfolio-page portfolio-page--scroll journey-page" data-current-section={currentSection}>
      <PortfolioNav
        activeSection={currentSection}
        onNavigateSection={scrollToSection}
        scrolled={currentSection !== 'home'}
      />
      <div className="journey-prism-state" aria-hidden="true">
        <img src="/assets/portfolio/home/prism.png" alt="" />
      </div>

      <section className="portfolio-section" id="home" aria-label="Portfolio Home">
        <ScaleStage className="home-stage" fitViewport fullBleed>
          <div className="home-glows" aria-hidden="true">
            <i className="glow glow-orange" /><i className="glow glow-pink" /><i className="glow glow-white" />
            <i className="glow glow-cyan" /><i className="glow glow-violet" /><i className="glow glow-purple" />
          </div>
          <span className="home-entry-beam" aria-hidden="true" />
          <HomeRasterGlass side="left" />
          <HomeRasterGlass side="right" />
          <img className="prism-shadow" src="/assets/portfolio/home/prism-shadow.png" alt="" />
          <img className="prism-visual" src="/assets/portfolio/home/prism.png" alt="透明折射棱镜" />
          <DisplayTitle variant="home" />
          <div className="home-name" aria-label="张睿作品集"><span>张睿</span><span>作品集</span></div>
          <div className="home-statement"><p>设计是一面棱镜</p><p>折射生活·照亮美好</p></div>
          <button className="design-link" type="button" onClick={() => scrollToSection('work')} aria-label="进入精选项目"><DisplayTitle variant="design" /></button>
        </ScaleStage>
      </section>

      <section className="portfolio-section about-scroll-section" id="about" aria-label="About Me">
        <AboutStage onNavigate={() => scrollToSection('home')} fitViewport />
      </section>

      <IndexSection projects={projects} onOpenProject={(project) => onNavigate(`/work/${project.slug}`)} />
      <BeyondSection onContinue={scrollToSection} />
      <EndingSection onBackToTop={scrollToSection} />
    </main>
  );
}
