import PixelGlyph from './PixelGlyph';

export default function PortfolioTitle() {
  return (
    <h1 className="portfolio-title" aria-label="Portfolio">
      <span className="portfolio-glyph serif-glyph is-capital" aria-hidden="true">P</span>
      <span className="portfolio-glyph pixel-wrap"><PixelGlyph /></span>
      <span className="portfolio-glyph serif-glyph" aria-hidden="true">r</span>
      <span className="portfolio-glyph cut-glyph" aria-hidden="true">t</span>
      <span className="portfolio-glyph block-glyph" aria-hidden="true">f</span>
      <span className="portfolio-glyph pixel-wrap"><PixelGlyph /></span>
      <span className="portfolio-glyph serif-glyph" aria-hidden="true">l</span>
      <span className="portfolio-glyph pixel-wrap is-last"><PixelGlyph char="i" /></span>
      <span className="portfolio-glyph pixel-wrap"><PixelGlyph /></span>
    </h1>
  );
}
