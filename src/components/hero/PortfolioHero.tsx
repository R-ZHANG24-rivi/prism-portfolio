import CrystalScene from './CrystalScene';

export default function PortfolioHero() {
  return (
    <section id="hero" className="hero-section portfolio-hero" data-chapter="REFRACTION" aria-labelledby="portfolio-title">
      <CrystalScene />
      <div className="hero-copy">
        <p className="hero-kicker">DIGITAL PRODUCT DESIGNER · SHANGHAI</p>
        <h1 id="portfolio-title" className="hero-title">
          <span className="hero-title-line">RUI</span>
          <span className="hero-title-line hero-title-line--outline">ZHANG</span>
        </h1>
        <div className="hero-intro">
          <p className="hero-name">张睿 / 作品集 2026</p>
          <p className="hero-statement">设计是一束光。<br />折射日常，显现未被看见的可能。</p>
        </div>
      </div>
      <div className="hero-meta" aria-hidden="true">
        <span>01 — REFRACTION STUDY</span>
        <span>GLASS / LIGHT / SPECTRUM</span>
      </div>
      <a className="hero-scroll" href="#about" aria-label="向下浏览关于我">
        <span>SCROLL TO DISCOVER</span>
        <i />
      </a>
    </section>
  );
}
